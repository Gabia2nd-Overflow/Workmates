import React from "react";

export default function CompletionDonut({ total = 0, completed = 0, rate = 0 }) {
  const r = 60;
  const stroke = 14;
  const c = 2 * Math.PI * r;
  const safeTotal = Math.max(0, total);
  const safeCompleted = Math.min(safeTotal, Math.max(0, completed));
  const pct = safeTotal === 0 ? 0 : Math.max(0, Math.min(100, rate));
  const dash = (pct / 100) * c;

  return (
    <div className="donut-wrap">
      <div style={{ position: "relative", width: 160, height: 160 }}>
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle
            cx="80" cy="80" r={r}
            fill="transparent"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={stroke}
          />
          <circle
            cx="80" cy="80" r={r}
            fill="transparent"
            stroke="url(#grad)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c - dash}`}
            transform="rotate(-90 80 80)"
          />
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>
        </svg>
        <div className="donut-center">
          <div style={{ textAlign: "center", lineHeight: 1.2 }}>
            <div>{safeCompleted} / {safeTotal}</div>
            <div style={{ fontSize: 20 }}>{Math.round(pct)}%</div>
          </div>
        </div>
      </div>
      <div>
        <div style={{ color: "#9ca3af", fontSize: 12, marginBottom: 6 }}>
          완료/전체 비율
        </div>
        <div style={{ fontSize: 14 }}>
          완료 {safeCompleted}건 · 전체 {safeTotal}건
        </div>
        <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 6 }}>
          완료율은 서버 제공 값을 그대로 표시합니다.
        </div>
      </div>
    </div>
  );
}