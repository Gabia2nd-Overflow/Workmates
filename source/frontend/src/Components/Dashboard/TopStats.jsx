import React from "react";

export default function TopStats({ dueSoonCount = 0, overdueCount = 0, incompleteByImportance = {} }) {
  const high = incompleteByImportance.HIGH || 0;
  const med  = incompleteByImportance.MEDIUM || 0;
  const low  = incompleteByImportance.LOW || 0;

  return (
    <div className="metrics">
      <div className="metric">
        <div className="label">마감 임박</div>
        <div className="value">{dueSoonCount}</div>
      </div>
      <div className="metric">
        <div className="label">연체</div>
        <div className="value">{overdueCount}</div>
      </div>
      <div className="metric">
        <div className="label">중요도별 미완료</div>
        <div className="value">
          <span className="badge high">
            <span className="k">HIGH</span>
            <span className="n">{high}</span>
          </span>
          &nbsp;&nbsp;
          <span className="badge medium">
            <span className="k">MED</span>
            <span className="n">{med}</span>
          </span>
          &nbsp;&nbsp;
          <span className="badge low">
            <span className="k">LOW</span>
            <span className="n">{low}</span>
          </span>
        </div>
      </div>
    </div>
  );
}