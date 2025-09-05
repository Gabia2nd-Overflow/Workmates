import React, { useMemo } from "react";

export default function DashboardHeader({ onClose }) {
  const updatedAt = useMemo(() => {
    const now = new Date();
    // Asia/Seoul 기준 포맷
    const fmt = new Intl.DateTimeFormat("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit",
    });
    return fmt.format(now);
  }, []);

  return (
    <div className="panel-header">
      <div className="panel-title">대시보드</div>
      <div className="panel-actions">
        <span style={{ fontSize: 12, color: "#9ca3af" }}>
          마지막 갱신: {updatedAt}
        </span>
        <button className="panel-close" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}