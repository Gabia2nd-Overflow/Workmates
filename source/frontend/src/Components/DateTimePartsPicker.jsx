import React, { useEffect, useMemo, useState } from "react";

function pad2(n) {
  return String(n).padStart(2, "0");
}
function toDateStr(d) {
  const dt = typeof d === "string" ? new Date(d) : d;
  return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
}
function toParts(value) {
  const d = typeof value === "string" ? new Date(value) : (value ?? new Date());
  const date = toDateStr(d);
  let h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12; // 12시간제
  return { date, ampm, hour12: h, minute: m };
}
function fromParts(dateStr, ampm, hour12, minute) {
  const [yyyy, mm, dd] = dateStr.split("-").map(Number);
  let h24 = hour12 % 12;
  if (ampm === "PM") h24 += 12;
  if (ampm === "AM" && hour12 === 12) h24 = 0;
  const d = new Date(yyyy, mm - 1, dd, h24, minute, 0, 0);
  return d;
}

export default function DateTimePartsPicker({
  label,
  value,            // Date | ISO string
  onChange,         // (date: Date) => void
  min,              // Date | null -> 이보다 과거 선택 불가
  disabled = false,
  ampmLeft = true,  // 오전/오후를 왼쪽에
  minuteStep = 1,   // 분 간격
}) {
  const init = useMemo(() => toParts(value ?? new Date()), [value]);
  const [dateStr, setDateStr] = useState(init.date);
  const [ampm, setAmpm] = useState(init.ampm);
  const [hour12, setHour12] = useState(init.hour12);
  const [minute, setMinute] = useState(init.minute);

  useEffect(() => {
    // 외부 value가 바뀌면 동기화
    const p = toParts(value ?? new Date());
    setDateStr(p.date);
    setAmpm(p.ampm);
    setHour12(p.hour12);
    setMinute(p.minute);
  }, [value]);

  const minDateStr = min ? toDateStr(min) : undefined;

  const emit = (nextDateStr = dateStr, nextAmpm = ampm, nextHour = hour12, nextMin = minute) => {
    const d = fromParts(nextDateStr, nextAmpm, Number(nextHour), Number(nextMin));
    onChange(d);
  };

  const minutes = [];
  for (let m = 0; m < 60; m += minuteStep) minutes.push(m);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 6 }}>
      {label && <label>{label}</label>}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {/* 날짜 */}
        <input
          type="date"
          value={dateStr}
          onChange={(e) => { setDateStr(e.target.value); emit(e.target.value, undefined, undefined, undefined); }}
          min={minDateStr}
          disabled={disabled}
          style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb" }}
        />

        {/* 시간 (오전/오후 왼쪽) */}
        <div style={{ display: "flex", gap: 6 }}>
          {ampmLeft && (
            <select
              value={ampm}
              onChange={(e) => { setAmpm(e.target.value); emit(undefined, e.target.value, undefined, undefined); }}
              disabled={disabled}
              style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb" }}
            >
              <option value="AM">오전</option>
              <option value="PM">오후</option>
            </select>
          )}

          <select
            value={hour12}
            onChange={(e) => { setHour12(e.target.value); emit(undefined, undefined, e.target.value, undefined); }}
            disabled={disabled}
            style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb" }}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
              <option key={h} value={h}>{pad2(h)}</option>
            ))}
          </select>

          <select
            value={minute}
            onChange={(e) => { setMinute(e.target.value); emit(undefined, undefined, undefined, e.target.value); }}
            disabled={disabled}
            style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb" }}
          >
            {minutes.map((m) => (
              <option key={m} value={m}>{pad2(m)}</option>
            ))}
          </select>

          {!ampmLeft && (
            <select
              value={ampm}
              onChange={(e) => { setAmpm(e.target.value); emit(undefined, e.target.value, undefined, undefined); }}
              disabled={disabled}
              style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb" }}
            >
              <option value="AM">오전</option>
              <option value="PM">오후</option>
            </select>
          )}
        </div>
      </div>
    </div>
  );
}