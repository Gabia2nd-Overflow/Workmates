import React, { useEffect, useMemo, useState } from "react";
import "./dashboard.css";
import { useDashboard } from "../../../context/DashboardContext";
import { scheduleApi } from "../../services/scheduleApi";
import DashboardHeader from "./DashboardHeader";
import CompletionDonut from "./CompletionDonut";
import TopStats from "./TopStats";
import IncompleteScheduleList from "./IncompleteScheduleList";

export default function DashboardPanel() {
  const { isOpen, close, currentWorkshopId } = useDashboard();
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // 열릴 때마다 데이터 로딩
  useEffect(() => {
    let mounted = true;
    async function load() {
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
      {/* 백드롭 */}
      <div className="backdrop" onClick={close} />

      {/* 시트 */}
      <div className="sheet" role="dialog" aria-modal="true">
        <div className="dashboard-panel">
          <DashboardHeader onClose={close} />

          {/* 상단: 좌 도넛 / 우 지표 */}
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

          {/* 하단: 미완료 리스트 */}
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
        </div>
      </div>
    </div>
  );
}