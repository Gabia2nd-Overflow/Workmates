import React from "react";
import DayDiffLabel from "./DayDiffLabel";
import ImportanceBadge from "./ImportanceBadge";

function formatKST(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const fmt = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
  return fmt.format(d);
}

export default function IncompleteScheduleList({ items = [] }) {
  if (!items.length) {
    return <div style={{ color: "#9ca3af" }}>미완료 스케줄이 없습니다.</div>;
  }
  return (
    <div className="list">
      {items.map((it) => (
        <div key={it.id} className="list-item">
          <div className="title">{it.title}</div>
          <div className="date">{formatKST(it.dueDate)}</div>
          <div><DayDiffLabel iso={it.dueDate} /></div>
          <div><ImportanceBadge level={it.importancy} /></div>
        </div>
      ))}
    </div>
  );
}