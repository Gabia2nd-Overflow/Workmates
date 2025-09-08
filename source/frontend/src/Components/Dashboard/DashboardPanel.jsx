import React, { useEffect, useMemo, useState } from "react";
import { useLocation, matchPath } from "react-router-dom";
import "./Dashboard.css";
import { useDashboard } from "../../hooks/useDashboard";
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

  useEffect(() => {
    if (currentWorkshopId) return;
    // /workshops/:workshopId 또는 /workshops/:workshopId/… 를 모두 매칭
    const m =
      matchPath("/workshops/:workshopId/*", loc.pathname) ||
      matchPath("/workshops/:workshopId", loc.pathname);
    const wid = m?.params?.workshopId;
    if (wid) setCurrentWorkshopId(wid);
  }, [loc.pathname, currentWorkshopId, setCurrentWorkshopId]);

  // 열릴 때마다 데이터 로딩
  useEffect(() => {
    let mounted = true;
    async function load() {
      // workshopId가 아직 안 잡혔으면 대기
      if (!isOpen || !currentWorkshopId) return;
      setLoading(true);
      setErr("");
      try {
        const [s, list] = await Promise.all([
          scheduleApi.getStats(currentWorkshopId),
          scheduleApi.listIncomplete(currentWorkshopId),
        ]);
        if (!mounted) return;
        setStats(s);
        setItems(list || []);
      } catch (e) {
        if (!mounted) return;
        setErr(e?.message || "대시보드 데이터를 불러오지 못했습니다.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [isOpen, currentWorkshopId]);

  const overlayClass = useMemo(
    () => "dashboard-overlay" + (isOpen ? " open" : ""),
    [isOpen]
  );

  return (
    <div className={overlayClass} aria-hidden={!isOpen}>
      <div className="backdrop" onClick={close} />
      <div className="sheet" role="dialog" aria-modal="true">
        <div className="dashboard-panel">
          <DashboardHeader onClose={close} />

          {/* workshopId가 안 잡혔을 때 안내 */}
          {!currentWorkshopId ? (
            <div style={{ padding: 16, color: "#9ca3af" }}>
              현재 URL에서 워크샵 ID를 찾지 못했습니다. <br/>
              <b>/workshops/:workshopId</b> 경로에서 열어주세요.
            </div>
          ) : (
            <>
              <div className="dashboard-top">
                <div className="card">
                  <h3>완료 현황</h3>
                  {loading ? (
                    <div>불러오는 중…</div>
                  ) : stats ? (
                    <CompletionDonut
                      total={stats.total}
                      completed={stats.completedCount}
                      rate={stats.completionRate}
                    />
                  ) : err ? (
                    <div style={{ color: "#ef4444" }}>{err}</div>
                  ) : (
                    <div>데이터 없음</div>
                  )}
                </div>

                <div className="card">
                  <h3>마감 임박 · 중요도</h3>
                  {loading ? (
                    <div>불러오는 중…</div>
                  ) : stats ? (
                    <TopStats
                      dueSoonCount={stats.dueSoonCount}
                      overdueCount={stats.overdueCount}
                      incompleteByImportance={stats.incompleteByImportance || {}}
                    />
                  ) : err ? (
                    <div style={{ color: "#ef4444" }}>{err}</div>
                  ) : (
                    <div>데이터 없음</div>
                  )}
                </div>
              </div>

              <div className="dashboard-bottom">
                <div className="card">
                  <h3>미완료 스케줄 (마감일 오름차순)</h3>
                  {loading ? (
                    <div>불러오는 중…</div>
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