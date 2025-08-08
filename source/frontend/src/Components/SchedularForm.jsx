import { useEffect, useState } from 'react';

const empty = {
  title: '',
  context: '',
  startDate: '',
  dueDate: '',
  location: '',
  importancy: 'MEDIUM',
  completed: false,
};

export default function SchedularForm({ open, defaultValue, onClose, onSubmit }) {
  const [values, setValues] = useState(empty);

  useEffect(() => {
    if (defaultValue) {
      setValues({
        ...defaultValue,
        startDate: defaultValue.startDate?.slice(0, 16) ?? '',
        dueDate: defaultValue.dueDate?.slice(0, 16) ?? '',
      });
    } else setValues(empty);
  }, [defaultValue]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((v) => ({ ...v, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...values,
      startDate: values.startDate ? new Date(values.startDate).toISOString() : null,
      dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null,
    });
  };

  if (!open) return null;

  return (
    <div className="schedular-modal" role="dialog" aria-modal="true">
      <div className="schedular-panel">
        <h3>{defaultValue ? '일정 수정' : '새 일정'}</h3>
        <form onSubmit={handleSubmit} className="schedular-form">
          <label>
            제목
            <input name="title" value={values.title} onChange={handleChange} required />
          </label>
          <label>
            내용
            <textarea name="context" value={values.context} onChange={handleChange} />
          </label>
          <label>
            시작
            <input type="datetime-local" name="startDate" value={values.startDate} onChange={handleChange} />
          </label>
          <label>
            마감
            <input type="datetime-local" name="dueDate" value={values.dueDate} onChange={handleChange} />
          </label>
          <label>
            장소
            <input name="location" value={values.location} onChange={handleChange} />
          </label>
          <label>
            중요도
            <select name="importancy" value={values.importancy} onChange={handleChange}>
              <option value="HIGH">높음</option>
              <option value="MEDIUM">보통</option>
              <option value="LOW">낮음</option>
            </select>
          </label>
          {defaultValue && (
            <label className="inline">
              <input type="checkbox" name="completed" checked={values.completed} onChange={handleChange} />
              완료
            </label>
          )}

          <div className="schedular-actions">
            <button type="button" onClick={onClose}>취소</button>
            <button type="submit" className="primary">{defaultValue ? '저장' : '추가'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}