import { useEffect, useState } from 'react';
import { schedularAPI } from '../services/api';
import SchedularForm from '../Components/SchedularForm';
import SchedularCard from '../Components/SchedularCard';
import SchedularStats from '../Components/SchedularStats';
import '../styles/schedular.css';

export default function Schedular() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, dueSoon: 0 });
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        schedularAPI.getAll(),
        schedularAPI.getStats(),
      ]);
      setItems(listRes.data ?? []);
      setStats(statsRes.data ?? { total: 0, completed: 0, dueSoon: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleCreate = () => { setEditing(null); setOpenForm(true); };
  const handleEdit = (item) => { setEditing(item); setOpenForm(true); };

  const handleSubmit = async (values) => {
    if (editing) await schedularAPI.update(editing.id, values);
    else await schedularAPI.create(values);
    setOpenForm(false);
    await fetchAll();
  };

  const handleDelete = async (id) => {
    await schedularAPI.remove(id);
    await fetchAll();
  };

  return (
    <div className="schedular-page">
      <header className="schedular-header">
        <div className="title-wrap">
          <h1>스케줄러 관리</h1>
          <button className="primary" onClick={handleCreate}>+ 새 일정</button>
        </div>
        <SchedularStats stats={stats} />
      </header>

      {loading && <div className="schedular-loading">불러오는 중…</div>}

      <main className="schedular-list">
        {items.map((it) => (
          <SchedularCard
            key={it.id}
            item={it}
            onEdit={() => handleEdit(it)}
            onDelete={() => handleDelete(it.id)}
          />
        ))}
        {!loading && items.length === 0 && (
          <div className="schedular-empty">등록된 일정이 없습니다.</div>
        )}
      </main>

      {openForm && (
        <SchedularForm
          open={openForm}
          defaultValue={editing}
          onClose={() => setOpenForm(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}