import React, { useEffect, useMemo, useState } from "react";
import { useLocation, matchPath } from "react-router-dom";
import "./Dashboard.css";
import { useDashboard } from "./DashboardContext";
import { scheduleApi } from "../../services/api";
import DashboardHeader from "./DashboardHeader";
import CompletionDonut from "./CompletionDonut";
import TopStats from "./TopStats";
import IncompleteScheduleList from "./IncompleteScheduleList";

export default function DashboardPanel() {
  const loc = useLocation();
  const { isOpen, close, currentWorkshopId, setCurrentWorkshopId } = useDashboard();
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // 현재 URL에서 워크샵 ID 추출: /workshops/* + /schedules/* 둘 다 지원
  // ✅ 수정: currentWorkshopId가 이미 있어도 URL이 바뀌면 갱신합니다.
  useEffect(() => {
    const m = 
      matchPath("/workshops/:workshopId/*", loc.pathname) ||
      matchPath("/workshops/:workshopId", loc.pathname) ||
      matchPath("/schedules/:workshopId/*", loc.pathname);
    const wid = m?.params?.workshopId ?? null;

    if (wid && String(wid) !== String(currentWorkshopId || "")) {
      setCurrentWorkshopId(wid);
    }
  }, [loc.pathname, currentWorkshopId, setCurrentWorkshopId]);

  // 데이터 로더 (getStats + listIncomplete)
  async function load() {
    if (!isOpen || !currentWorkshopId) return;
    setLoading(true);
    setErr("");
    try {
      const [sRes, listRes] = await Promise.all([
        scheduleApi.getStats(currentWorkshopId),
        scheduleApi.listIncomplete(currentWorkshopId),
      ]);
      // Axios 응답/직접 데이터 모두 호환 처리
      const s = sRes?.data ?? sRes ?? null;
      const list = listRes?.data ?? listRes ?? [];
      setStats(s);
      setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      setErr(e?.message || "대시보드 데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  // 패널 열림/워크샵 변경 시 로딩
  useEffect(() => {
    if (!isOpen || !currentWorkshopId) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentWorkshopId]);

  // ✅ 스케줄 변경 전역 이벤트 수신 → 즉시 재조회
  useEffect(() => {
    const onMutated = (e) => {
      const widFromEvent = e?.detail?.workshopId;
      if (!isOpen) return;
      if (!currentWorkshopId) return;
      if (widFromEvent && String(widFromEvent) !== String(currentWorkshopId)) return;
      load();
    };
    window.addEventListener("schedules:mutated", onMutated);
    return () => window.removeEventListener("schedules:mutated", onMutated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentWorkshopId]);

  const overlayClass = useMemo(
    () => "dashboard-overlay" + (isOpen ? " open" : ""),
    [isOpen]
  );

  // 닫혀 있을 땐 렌더 자체를 안 해서 입력/포커스 간섭 0%
  if (!isOpen) return null;

  return (
    <div className={overlayClass} aria-hidden={!isOpen}>
      <div className="backdrop" onClick={close} />
      <div className="sheet" role="dialog" aria-modal="true">
        <div className="dashboard-panel">
          <DashboardHeader onClose={close} />

          {/* workshopId가 안 잡혔을 때 안내 */}
          {!currentWorkshopId ? (
            <div style={{ padding: 16, color: "#9ca3af" }}>
              현재 URL에서 워크샵 ID를 찾지 못했습니다. <br />
              <b>/workshops/:workshopId</b> 또는 <b>/schedules/:workshopId</b> 경로에서 열어주십시오.
            </div>
          ) : (
            <>
              <div className="dashboard-top">
                <div className="card">
                  <h3>완료 현황</h3>
                  {loading ? (
                    <div>불러오는 중입니다…</div>
                  ) : stats ? (
                    <CompletionDonut
                      total={stats.total}
                      completed={stats.completedCount}
                      rate={stats.completionRate}
                    />
                  ) : err ? (
                    <div style={{ color: "#ef4444" }}>{err}</div>
                  ) : (
                    <div>데이터가 없습니다.</div>
                  )}
                </div>

                <div className="card">
                  <h3>마감 임박 · 중요도</h3>
                  {loading ? (
                    <div>불러오는 중입니다…</div>
                  ) : stats ? (
                    <TopStats
                      dueSoonCount={stats.dueSoonCount}
                      overdueCount={stats.overdueCount}
                      incompleteByImportance={stats.incompleteByImportance || {}}
                    />
                  ) : err ? (
                    <div style={{ color: "#ef4444" }}>{err}</div>
                  ) : (
                    <div>데이터가 없습니다.</div>
                  )}
                </div>
              </div>

              <div className="dashboard-bottom">
                <div className="card">
                  <h3>미완료 스케줄 (마감일 오름차순)</h3>
                  {loading ? (
                    <div>불러오는 중입니다…</div>
                  ) : err ? (
                    <div style={{ color: "#ef4444" }}>{err}</div>
                  ) : (
                    <IncompleteScheduleList items={items} />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}