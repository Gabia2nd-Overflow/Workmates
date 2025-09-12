import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { workshopAPI } from "../services/api";
import { EVENT_OPEN_CREATE_WORKSHOP, EVENT_WORKSHOP_CREATED } from "./main_home/uiBus";
import CreateWorkshopModal from "./CreateWorkshopModal";
import "./Sidebar.css";

export default function Sidebar() {
  const [workshops, setWorkshops] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const listRef = useRef(null);
  const drag = useRef({ active: false, startY: 0, startTop: 0 });
  const navigate = useNavigate();
  const location = useLocation();

  const onMouseDown = (e) => {
    const el = listRef.current;
    if (!el) return;
    drag.current = { active: true, startY: e.clientY, startTop: el.scrollTop };
    el.classList.add("dragging");
  };

  const onMouseMove = (e) => {
    const el = listRef.current;
    if (!el || !drag.current.active) return;
    el.scrollTop = drag.current.startTop - (e.clientY - drag.current.startY);
  };

  const endDrag = () => {
    const el = listRef.current;
    drag.current.active = false;
    if (el) el.classList.remove("dragging");
  };

  // 최초 1회 목록 로드
  useEffect(() => {
    refreshList();
  }, []);

  // 홈에서 "서버 생성" 버튼 눌러 열라는 이벤트 수신
  useEffect(() => {
    const openHandler = () => setShowModal(true);
    window.addEventListener(EVENT_OPEN_CREATE_WORKSHOP, openHandler);
    return () => window.removeEventListener(EVENT_OPEN_CREATE_WORKSHOP, openHandler);
  }, []);

  // 생성 성공 이벤트 수신 → Sidebar 목록 즉시 갱신 + 즉시 갱신 시 가장 상단에 올라가기
  useEffect(() => {
  const createdHandler = (e) => {
    const w = e.detail;
    setWorkshops((prev) => {
      const has = prev.some((x) => String(x.workshopId) === String(w.workshopId));
      // ⬇️ 맨 위에 추가
      return has ? prev : [w, ...prev];
    });
  };
  window.addEventListener(EVENT_WORKSHOP_CREATED, createdHandler);
  return () => window.removeEventListener(EVENT_WORKSHOP_CREATED, createdHandler);
}, []);

  function refreshList() {
    workshopAPI
      .list()
      .then(({ data }) => setWorkshops(Array.isArray(data) ? data : []))
      .catch(() => setWorkshops([]));
  }

  // 현재 경로에서 정확히 워크샵 ID만 추출 (정규식 없이)
const activeWorkshopId = (() => {
  // pathname 예: "/workshops/117", "/workshops/117/threads/3"
  if (!location?.pathname) return undefined;
  const path = location.pathname;               // pathname에는 원래 ?,# 없음
  if (!path.startsWith("/workshops/")) return undefined;
  const rest = path.slice("/workshops/".length); // "117/threads/3" 또는 "117"
  const id = rest.split("/")[0];                 // "117"
  return id || undefined;
})();

  return (
    <aside className="ws-sidebar">
      <div
        className="ws-list"
        ref={listRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
      >
        {workshops.map((w) => {
          const isActive = String(w.workshopId) === String(activeWorkshopId); // ★ 정확 비교
          return (
            <button
              key={w.workshopId}
              onClick={() => navigate(`/workshops/${w.workshopId}`)}
              className={`ws-icon-btn ${isActive ? "ws-icon-btn--active" : "ws-icon-btn--idle"}`}
              title={w.workshopName}
            >
              {(w.workshopName || "?")[0].toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* + 버튼 */}
      <button
        onClick={() => setShowModal(true)}
        className="ws-create-btn"
        title="새 워크샵"
      >
        +
      </button>

      {/* 공용 모달 */}
      <CreateWorkshopModal show={showModal} onClose={() => setShowModal(false)} />
    </aside>
  );
}
