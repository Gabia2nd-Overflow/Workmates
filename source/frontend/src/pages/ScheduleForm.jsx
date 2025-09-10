import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { scheduleApi, loungeAPI, threadAPI, workshopAPI } from "../services/api";
import useToast from "./useToast";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import UserFooter from "../Components/UserFooter";
import LoungeSection from "../Components/LoungeSection";
import ThreadSection from "../Components/ThreadSection";
import "./WorkShopDetail.css";

function toLocalInputValue(date) {
  const d = typeof date === "string" ? new Date(date) : date ?? new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const HH = pad(d.getHours());
  const MM = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${HH}:${MM}`;
}

const IMPORTANCES = ["LOW", "MEDIUM", "HIGH"];

export default function ScheduleForm({ mode }) {
  const { workshopId, scheduleId } = useParams();
  const navigate = useNavigate();
  const { show, ToastPortal } = useToast();

  const isCreate = mode === "create";
  const wasCompletedRef = useRef(false); // 최초 완료 여부 보존

  // 폼
  const [form, setForm] = useState({
    title: "",
    content: "",
    startDate: toLocalInputValue(new Date()),
    dueDate: toLocalInputValue(new Date()),
    importancy: "MEDIUM",
    isCompleted: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // 보조 사이드바(워크샵 요약) 데이터
  const [workshop, setWorkshop] = useState(null);
  const [lounges, setLounges] = useState([]);
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    if (!workshopId) return;

    // 보조 사이드바 데이터
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
      } catch {
        /* ignore */
      }
    })();

    // 수정 모드면 기존 데이터 로딩
    if (!isCreate && scheduleId) {
      (async () => {
        try {
          const res = await scheduleApi.listAll(workshopId);
          const found = (res.data ?? []).find((x) => String(x.id) === String(scheduleId));
          if (!found) {
            show("스케줄을 찾을 수 없습니다.", "error");
            navigate(-1);
            return;
          }
          setForm({
            title: found.title ?? "",
            content: found.content ?? "",
            startDate: toLocalInputValue(found.startDate),
            dueDate: toLocalInputValue(found.dueDate),
            importancy: String(found.importancy ?? "MEDIUM").toUpperCase(),
            isCompleted: !!found.isCompleted,
          });
          wasCompletedRef.current = !!found.isCompleted;
        } catch {
          show("스케줄을 불러오지 못했습니다.", "error");
          navigate(-1);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreate, scheduleId, workshopId]);

  const validate = () => {
    const e = {};
    const title = (form.title ?? "").trim();
    const content = (form.content ?? "").trim();

    if (!title) e.title = "제목은 필수입니다.";
    if (title.length > 50) e.title = "제목은 50자 이하여야 합니다.";
    if (content.length > 200) e.content = "내용은 200자 이하여야 합니다.";

    const s = new Date(form.startDate);
    const d = new Date(form.dueDate);
    const now = new Date();

    if (s < now && isCreate) e.startDate = "시작일시는 현재 시각 이후여야 합니다.";
    if (d < s) e.dueDate = "마감일시는 시작일시 이후여야 합니다.";

    if (!IMPORTANCES.includes(String(form.importancy).toUpperCase())) {
      e.importancy = "중요도 값이 올바르지 않습니다.";
    }
    return e;
  };

  const onChange = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const nowInput = useMemo(() => toLocalInputValue(new Date()), []);
  const startMin = isCreate ? nowInput : undefined;
  const dueMin = form.startDate || nowInput;

  const dispatchMutated = () =>
    window.dispatchEvent(new CustomEvent("schedules:mutated", { detail: { workshopId } }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const eobj = validate();
    setErrors(eobj);
    if (Object.keys(eobj).length > 0) {
      show("입력값을 확인해 주십시오.", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: form.title.trim(),
        content: form.content.trim(), // 백엔드가 'context'면 교체
        startDate: form.startDate,
        dueDate: form.dueDate,
        importancy: form.importancy,
        isCompleted: !!form.isCompleted,
      };

      if (isCreate) {
        await scheduleApi.create(workshopId, payload);
        show("스케줄을 저장했습니다.", "success");
        dispatchMutated();
        navigate(`/schedules/${workshopId}/schedules`);
      } else {
        await scheduleApi.update(scheduleId, payload);
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
      {/* 전역 사이드바(좌측 고정) */}
      <Sidebar />

      {/* 상세 레이아웃: wsd__sidebar + wsd__content */}
      <div className="wsd__layout">
        {/* ✅ 보조 사이드바 유지 */}
        <aside className="wsd__sidebar">
          <h3 className="wsd__title" title={workshop?.workshopName}>
            {workshop?.workshopName || "Workshop"}
          </h3>

          <LoungeSection workshopId={workshopId} lounges={lounges} setLounges={setLounges} />
          <ThreadSection workshopId={workshopId} threads={threads} setThreads={setThreads} />
        </aside>

        {/* 스케줄 폼 본문 */}
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

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label>시작일시</label>
                  <input
                    type="datetime-local"
                    value={form.startDate}
                    onChange={onChange("startDate")}
                    min={startMin}
                    required
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb" }}
                  />
                  {errors.startDate && <div style={{ color: "#b91c1c", marginTop: 6 }}>{errors.startDate}</div>}
                </div>
                <div>
                  <label>마감일시</label>
                  <input
                    type="datetime-local"
                    value={form.dueDate}
                    onChange={onChange("dueDate")}
                    min={dueMin}
                    required
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb" }}
                  />
                  {errors.dueDate && <div style={{ color: "#b91c1c", marginTop: 6 }}>{errors.dueDate}</div>}
                </div>
              </div>

              <div>
                <label>중요도</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["LOW", "MEDIUM", "HIGH"].map((opt) => (
                    <label
                      key={opt}
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: 8,
                        padding: "6px 10px",
                        cursor: "pointer",
                        background: form.importancy === opt ? "#f1f5f9" : "#fff",
                      }}
                    >
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
                      // 이미 완료된 건 해제 불가
                      if (wasCompletedRef.current && !e.target.checked) {
                        show("완료된 스케줄은 되돌릴 수 없습니다.", "info");
                        return;
                      }
                      setForm((p) => ({ ...p, isCompleted: e.target.checked }));
                    }}
                    disabled={wasCompletedRef.current} // 이미 완료면 조작 불가
                    title={wasCompletedRef.current ? "완료된 스케줄은 되돌릴 수 없습니다." : "완료 처리합니다."}
                  />
                  완료 처리
                </label>
              )}

              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button type="submit" className="btn btn--primary" disabled={loading}>
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