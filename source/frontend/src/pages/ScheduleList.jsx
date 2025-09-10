import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { scheduleApi, loungeAPI, threadAPI, workshopAPI } from "../services/api";
import useToast from "./useToast";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import UserFooter from "../Components/UserFooter";
import LoungeSection from "../Components/LoungeSection";
import ThreadSection from "../Components/ThreadSection";
import "./WorkShopDetail.css";

function formatYmdHm(isoOrDate) {
  const d = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const HH = pad(d.getHours());
  const MM = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd} ${HH}:${MM}`;
}
function truncate(str, n) {
  if (!str) return "";
  return str.length > n ? str.slice(0, n) + "…" : str;
}

export default function ScheduleList() {
  const { workshopId } = useParams();
  const navigate = useNavigate();
  const { show, ToastPortal } = useToast();

  // 스케줄 데이터
  const [items, setItems] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(false);

  // 보조 사이드바(워크샵 요약) 데이터
  const [workshop, setWorkshop] = useState(null);
  const [lounges, setLounges] = useState([]);
  const [threads, setThreads] = useState([]);

  const sorted = useMemo(
    () => [...items].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)),
    [items]
  );

  async function loadSchedules() {
    setLoading(true);
    try {
      const res = await scheduleApi.listAll(workshopId);
      setItems(res.data ?? []);
    } catch {
      show("스케줄을 불러오지 못했습니다.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function loadSidebarData() {
    try {
      const [{ data: ws }, { data: lData }, tRes] = await Promise.all([
        workshopAPI.get(workshopId),
        loungeAPI.list(workshopId),
        // threadAPI.list는 Axios 응답 형태 주의
        threadAPI.list(workshopId),
      ]);
      setWorkshop(ws || null);
      setLounges(Array.isArray(lData) ? lData : []);
      const tData = Array.isArray(tRes?.data) ? tRes.data : (Array.isArray(tRes) ? tRes : []);
      setThreads(tData);
    } catch {
      // 보조 사이드바 데이터는 실패해도 페이지 진행 가능
    }
  }

  useEffect(() => {
    if (!workshopId) return;
    loadSchedules();
    loadSidebarData();

    // 스케줄 변경 이벤트 수신 시 재조회
    const onMutated = (e) => {
      const wid = e?.detail?.workshopId;
      if (!wid || String(wid) === String(workshopId)) {
        loadSchedules();
        loadSidebarData();
      }
    };
    window.addEventListener("schedules:mutated", onMutated);
    return () => window.removeEventListener("schedules:mutated", onMutated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workshopId]);

  const onToggleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id));

  const dispatchMutated = () =>
    window.dispatchEvent(new CustomEvent("schedules:mutated", { detail: { workshopId } }));

  const onToggleCompleted = async (item) => {
    const ok = window.confirm("정말로 해당 스케줄이 완료되었습니까?");
    if (!ok) return;
    try {
      const payload = {
        title: item.title,
        content: item.content,      // 백엔드가 'context' 키면 교체
        startDate: item.startDate,
        dueDate: item.dueDate,
        importancy: item.importancy,
        isCompleted: !item.isCompleted,
      };
      await scheduleApi.update(item.id, payload);
      show("완료 상태를 변경했습니다.", "success");
      setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, isCompleted: !x.isCompleted } : x)));
      dispatchMutated();
    } catch {
      show("상태 변경에 실패했습니다.", "error");
    }
  };

  const onRemove = async (id) => {
    const ok = window.confirm("정말 해당 스케줄을 삭제하시겠습니까?");
    if (!ok) return;
    try {
      await scheduleApi.remove(id);
      show("스케줄을 삭제했습니다.", "success");
      setItems((prev) => prev.filter((x) => x.id !== id));
      dispatchMutated();
    } catch {
      show("삭제에 실패했습니다.", "error");
    }
  };

  const goNew = () => navigate(`/schedules/${workshopId}/schedules/new`);
  const goEdit = (id) => navigate(`/schedules/${id}/edit`);

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

        {/* 스케줄 본문 */}
        <section className="wsd__content" style={{ padding: "20px 24px" }}>
          <div style={{ width: "100%", maxWidth: 920, margin: "0 auto" }}>
            <ToastPortal />
            <header style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
              <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>스케줄</h1>
              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <button className="btn btn--primary" onClick={goNew}>새 스케줄</button>
              </div>
            </header>

            {loading ? (
              <div>불러오는 중입니다…</div>
            ) : sorted.length === 0 ? (
              <div>등록된 스케줄이 없습니다.</div>
            ) : (
              <ul style={{ display: "flex", flexDirection: "column", gap: 12, margin: 0, padding: 0 }}>
                {sorted.map((item) => {
                  const expanded = expandedId === item.id;
                  return (
                    <li
                      key={item.id}
                      onClick={() => onToggleExpand(item.id)}
                      style={{
                        listStyle: "none",
                        border: "1px solid #e5e7eb",
                        borderRadius: 12,
                        padding: "14px 16px",
                        background: "#fff",
                        cursor: "pointer",
                        boxShadow: "0 1px 2px rgba(0,0,0,.04)",
                      }}
                    >
                      <div style={{ display: "flex", gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, marginBottom: 6 }}>{item.title}</div>
                          <div style={{ color: "#555", marginBottom: 8 }}>
                            {expanded ? item.content : truncate(item.content, 50)}
                          </div>
                          <div style={{ display: "flex", gap: 12, fontSize: 14, color: "#444" }}>
                            <span>시작: {formatYmdHm(item.startDate)}</span>
                            <span>마감: {formatYmdHm(item.dueDate)}</span>
                            <span>중요도: {String(item.importancy)}</span>
                            <span>상태: {item.isCompleted ? "완료" : "미완료"}</span>
                          </div>
                        </div>

                        {/* 우측 조작부 */}
                        <div
                          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, minWidth: 72 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* 완료 체크박스 (상단) */}
                          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <input
                              type="checkbox"
                              checked={!!item.isCompleted}
                              onChange={() => onToggleCompleted(item)}
                            />
                            완료
                          </label>

                          {/* 수정/삭제 아이콘 (한 줄) */}
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <button
                              onClick={() => goEdit(item.id)}
                              title="수정"
                              style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: 18 }}
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => onRemove(item.id)}
                              title="삭제"
                              style={{ border: "none", background: "transparent", cursor: "pointer", color: "#b91c1c", fontSize: 18 }}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <UserFooter />
        </section>
      </div>
    </div>
  );
}