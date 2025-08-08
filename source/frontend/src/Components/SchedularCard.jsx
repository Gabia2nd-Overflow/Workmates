export default function SchedularCard({ item, onEdit, onDelete }) {
  const due = item.dueDate ? new Date(item.dueDate) : null;
  const start = item.startDate ? new Date(item.startDate) : null;

  return (
    <div className={`schedular-card ${item.importancy?.toLowerCase()}`}>
      <div className="schedular-title-row">
        <h4>{item.title}</h4>
        <span className="badge">{item.importancy}</span>
      </div>
      {item.context && <p className="schedular-context">{item.context}</p>}
      <div className="schedular-meta">
        {start && <span>시작 {start.toLocaleString()}</span>}
        {due && <span>마감 {due.toLocaleString()}</span>}
        {item.location && <span>장소 {item.location}</span>}
        {item.completed && <span className="done">완료</span>}
      </div>
      <div className="schedular-row-actions">
        <button onClick={onEdit}>수정</button>
        <button onClick={onDelete}>삭제</button>
      </div>
    </div>
  );
}