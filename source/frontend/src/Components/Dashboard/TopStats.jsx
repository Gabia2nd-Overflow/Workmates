import React from "react";

export default function TopStats({ dueSoonCount = 0, overdueCount = 0, incompleteByImportance = {} }) {
  const high = incompleteByImportance.HIGH || 0;
  const med  = incompleteByImportance.MEDIUM || 0;
  const low  = incompleteByImportance.LOW || 0;

  return (
    <div className="metrics">
      <div className="metric">
        <div className="label">마감 7일 이하(미완료)</div>
        <div className="value">{dueSoonCount}</div>
      </div>
      <div className="metric">
        <div className="label">연체(미완료)</div>
        <div className="value">{overdueCount}</div>
      </div>
      <div className="metric">
        <div className="label">중요도별 미완료</div>
        <div className="value">
          <span className="badge high">HIGH {high}</span>&nbsp;&nbsp;
          <span className="badge medium">MED {med}</span>&nbsp;&nbsp;
          <span className="badge low">LOW {low}</span>
        </div>
      </div>
    </div>
  );
}