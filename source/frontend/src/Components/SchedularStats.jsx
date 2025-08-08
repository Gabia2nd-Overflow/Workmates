export default function SchedularStats({ stats }) {
  return (
    <div className="schedular-stats">
      <div className="stat">
        <div className="label">총 일정</div>
        <div className="value">{stats.total ?? 0}</div>
      </div>
      <div className="stat">
        <div className="label">완료</div>
        <div className="value">{stats.completed ?? 0}</div>
      </div>
      <div className="stat">
        <div className="label">임박(7일)</div>
        <div className="value">{stats.dueSoon ?? 0}</div>
      </div>
    </div>
  );
}