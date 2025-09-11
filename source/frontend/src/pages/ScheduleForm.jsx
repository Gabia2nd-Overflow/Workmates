import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { scheduleApi, loungeAPI, threadAPI, workshopAPI } from "../services/api";
import useToast from "./useToast";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import UserFooter from "../Components/UserFooter";
import LoungeSection from "../Components/LoungeSection";
import ThreadSection from "../Components/ThreadSection";
import "./WorkShopDetail.css";
/* ✅ 커스텀 시간 픽커 */
import DateTimePartsPicker from "../Components/DateTimePartsPicker";

// 로컬 타임존 기반, 오프셋/‘Z’ 없는 ISO 문자열
function toLocalNaiveISO(dt) {
  const d = typeof dt === "string" ? new Date(dt) : dt;
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const HH = pad(d.getHours());
  const MM = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${HH}:${MM}:00`;
}

const IMPORTANCES = ["LOW", "MEDIUM", "HIGH"];

export default function ScheduleForm({ mode }) {
  const { workshopId, scheduleId, id } = useParams();
  const realScheduleId = scheduleId || id;

  const navigate = useNavigate();
  const { show, ToastPortal } = useToast();
  const isCreate = mode === "create";

  // 최초 완료 여부(회귀 방지)
  const wasCompletedRef = useRef(false);
  // 편집 시 최초 startDate(과거 수정 금지)
  const originalStartRef = useRef(null);

  // 폼
  const [form, setForm] = useState({
    title: "",
    content: "",
    importancy: "MEDIUM",
    isCompleted: false,
  });

  // ✅ 커스텀 픽커 값(객체 Date로 보관)
  const [startValue, setStartValue] = useState(new Date());
  const [dueValue, setDueValue] = useState(new Date());

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // 보조 사이드바 데이터
  const [workshop, setWorkshop] = useState(null);
  const [lounges, setLounges] = useState([]);
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    if (!workshopId) return;
    (async () => {
      try {
        const [{ data: ws }, { data: lData }, tRes] = await Promise.all([
          workshopAPI.get(workshopId),
          loungeAPI.list(workshopId),
          threadAPI.list(workshopId),
        ]);
        setWorkshop(ws || null);
        setLounges(Array.isArray(lData) ? lData : []);
        const tData = Array.isArray(tRes?.data) ? tRes.data : (Array.isArray(tRes) ? tRes : []);
        setThreads(tData);
      } catch {/* ignore */}
    })();

    // 수정 모드면 기존 데이터 로딩
    if (!isCreate && realScheduleId) {
      (async () => {
        try {
          let found;
          try {
            const resOne = await scheduleApi.getOne(realScheduleId);
            found = resOne?.data ?? resOne;
          } catch {
            const res = await scheduleApi.listAll(workshopId);
            found = (res.data ?? []).find((x) => String(x.id) === String(realScheduleId));
          }
          if (!found) {
            show("스케줄을 찾을 수 없습니다.", "error");
            navigate(-1);
            return;
          }
          setForm({
            title: found.title ?? "",
            content: found.content ?? "",
            importancy: String(found.importancy ?? "MEDIUM").toUpperCase(),
            isCompleted: !!found.isCompleted,
          });
          const s = new Date(found.startDate);
          const d = new Date(found.dueDate);
          setStartValue(s);
          setDueValue(d);
          originalStartRef.current = s;
          wasCompletedRef.current = !!found.isCompleted;
        } catch {
          show("스케줄을 불러오지 못했습니다.", "error");
          navigate(-1);
        }
      })();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workshopId, isCreate, realScheduleId]);

  // 검증
  const validate = () => {
    const e = {};
    const title = (form.title ?? "").trim();
    const content = (form.content ?? "").trim();
    if (!title) e.title = "제목은 필수입니다.";
    if (title.length > 50) e.title = "제목은 50자 이하여야 합니다.";
    if (content.length > 200) e.content = "내용은 200자 이하여야 합니다.";

    const s = new Date(startValue);
    const d = new Date(dueValue);
    const nowLocal = new Date();
    // 비교 정확도를 맞추기 위해 초/밀리초 제거(선택 사항이지만 권장)
    s.setSeconds(0,0); d.setSeconds(0,0); nowLocal.setSeconds(0,0);

    if (isCreate) {
      if (s < nowLocal) e.startDate = "시작일시는 현재 시각 이후여야 합니다.";
    } else if (originalStartRef.current && s < originalStartRef.current) {
      e.startDate = "시작일시는 최초 저장 시각보다 과거로 수정할 수 없습니다.";
    }
    if (d < s) e.dueDate = "마감일시는 시작일시 이후여야 합니다.";

    if (!IMPORTANCES.includes(String(form.importancy).toUpperCase())) {
      e.importancy = "중요도 값이 올바르지 않습니다.";
    }
    return e;
  };

  // 값이 바뀔 때마다 실시간 재검증 → 저장 버튼 비활성화에 사용
  useEffect(() => {
    setErrors(validate());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.title, form.content, form.importancy, startValue, dueValue, isCreate]);

  const onChange = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  // ✅ 동적 now (렌더 시점의 현재시간)
  const now = new Date();
  // 생성: 현재시간 이상 / 수정: 최초 start 이상 (팀 정책상 ‘지금 이전 수정 금지’도 원하면 Math.max 적용)
  const startMin = isCreate ? now : (originalStartRef.current || now);
  // 마감은 항상 시작 이상
  const dueMin = startValue;

  const dispatchMutated = () =>
    window.dispatchEvent(new CustomEvent("schedules:mutated", { detail: { workshopId } }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const eobj = validate();
    setErrors(eobj);
    if (Object.keys(eobj).length > 0) {
      // ✅ 보정 없이 “차단 + 경고창”
      const msg =
        eobj.startDate ||
        eobj.dueDate ||
        eobj.title ||
        eobj.content ||
        eobj.importancy ||
        "입력값을 확인해 주십시오.";
      window.alert(msg); // 경고창
      show(msg, "error"); // 토스트(일관된 UX)
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: form.title.trim(),
        content: form.content.trim(),
        startDate: toLocalNaiveISO(startValue),
        dueDate: toLocalNaiveISO(dueValue),
        importancy: form.importancy,
        isCompleted: wasCompletedRef.current ? true : !!form.isCompleted,
      };

      if (isCreate) {
        await scheduleApi.create(workshopId, payload);
        show("스케줄을 저장했습니다.", "success");
        dispatchMutated();
        navigate(`/schedules/${workshopId}/schedules`);
      } else {
        await scheduleApi.update(realScheduleId, payload);
        show("스케줄을 수정했습니다.", "success");
        dispatchMutated();
        navigate(-1);
      }
    } catch {
      show("저장에 실패했습니다. 입력값과 권한을 확인해 주십시오.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page page--workshop-detail">
      <Header />
      <Sidebar />

      <div className="wsd__layout">
        {/* 보조 사이드바 */}
        <aside className="wsd__sidebar">
          <h3 className="wsd__title" title={workshop?.workshopName}>
            {workshop?.workshopName || "Workshop"}
          </h3>
          <LoungeSection workshopId={workshopId} lounges={lounges} setLounges={setLounges} />
          <ThreadSection workshopId={workshopId} threads={threads} setThreads={setThreads} />
        </aside>

        {/* 본문 */}
        <section className="wsd__content" style={{ padding: "20px 24px" }}>
          <div style={{ width: "100%", maxWidth: 720, margin: "0 auto" }}>
            <ToastPortal />
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
              {isCreate ? "스케줄 생성" : "스케줄 수정"}
            </h1>

            <form onSubmit={onSubmit} style={{ display: "grid", gap: 16 }}>
              <div>
                <label>제목</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={onChange("title")}
                  maxLength={50}
                  required
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb" }}
                />
                {errors.title && <div style={{ color: "#b91c1c", marginTop: 6 }}>{errors.title}</div>}
              </div>

              <div>
                <label>내용</label>
                <textarea
                  value={form.content}
                  onChange={onChange("content")}
                  maxLength={200}
                  rows={5}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb" }}
                />
                {errors.content && <div style={{ color: "#b91c1c", marginTop: 6 }}>{errors.content}</div>}
              </div>

              {/* ✅ 커스텀 시간 UI: AM/PM 왼쪽, 비순환, min 제약 준수 */}
              <DateTimePartsPicker
                label="시작일시"
                value={startValue}
                onChange={setStartValue}
                min={startMin}
                ampmLeft
                minuteStep={1}
              />
              {errors.startDate && <div style={{ color: "#b91c1c" }}>{errors.startDate}</div>}

              <DateTimePartsPicker
                label="마감일시"
                value={dueValue}
                onChange={setDueValue}
                min={dueMin}
                ampmLeft
                minuteStep={1}
              />
              {errors.dueDate && <div style={{ color: "#b91c1c" }}>{errors.dueDate}</div>}

              <div>
                <label>중요도</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["LOW", "MEDIUM", "HIGH"].map((opt) => (
                    <label key={opt} style={{
                      border: "1px solid #e5e7eb", borderRadius: 8, padding: "6px 10px", cursor: "pointer",
                      background: form.importancy === opt ? "#f1f5f9" : "#fff"
                    }}>
                      <input
                        type="radio"
                        name="importance"
                        value={opt}
                        checked={form.importancy === opt}
                        onChange={() => setForm((prev) => ({ ...prev, importancy: opt }))}
                        style={{ marginRight: 6 }}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
                {errors.importancy && <div style={{ color: "#b91c1c", marginTop: 6 }}>{errors.importancy}</div>}
              </div>

              {!isCreate && (
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={!!form.isCompleted}
                    onChange={(e) => {
                      if (wasCompletedRef.current && !e.target.checked) {
                        show("완료된 스케줄은 되돌릴 수 없습니다.", "info");
                        return;
                      }
                      setForm((p) => ({ ...p, isCompleted: e.target.checked }));
                    }}
                    disabled={wasCompletedRef.current}
                    title={wasCompletedRef.current ? "완료된 스케줄은 되돌릴 수 없습니다." : "완료 처리합니다."}
                  />
                  완료 처리
                </label>
              )}

              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button type="submit" className="btn btn--primary" disabled={loading || Object.keys(errors).length > 0}>
                  {isCreate ? "저장" : "수정 저장"}
                </button>
                <button type="button" className="btn btn--light" onClick={() => navigate(-1)}>
                  취소
                </button>
              </div>
            </form>
            <UserFooter />
          </div>
        </section>
      </div>
    </div>
  );
}