// src/components/Sidebar.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { workshopAPI } from "../services/api";

export default function Sidebar() {
  const [workshops, setWorkshops] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    workshopName: "",
    workshopIconImage: "",
    workshopDescription: "",
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    workshopAPI.list().then(({ data }) => setWorkshops(data)).catch(() => setWorkshops([]));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const { data } = await workshopAPI.create(form);
    setWorkshops((prev) => [...prev, data]);
    setForm({ workshopName: "", workshopIconImage: "", workshopDescription: "" });
    setShowModal(false);
    navigate(`/workshops/${data.workshopId}`);
  };

  return (
    <aside className="ws-sidebar">
      {/* 워크샵 아이콘 리스트 */}
      <div className="ws-list">
        {workshops.map((w) => (
          <button
            key={w.workshopId}
            onClick={() => navigate(`/workshops/${w.workshopId}`)}
            className={`ws-icon-btn
                       ${location.pathname.includes(`/workshops/${w.workshopId}`) ? "ws-icon-btn--active" : "ws-icon-btn--idle"}`}
            title={w.workshopName}
          >
            {(w.workshopName || "?")[0].toUpperCase()}
          </button>
        ))}
      </div>

      {/* + 생성 버튼 */}
      <button
        onClick={() => setShowModal(true)}
        className="ws-create-btn"
        title="새 워크샵"
      >
        +
      </button>

      {/* 생성 모달 */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 className="text-lg font-bold mb-4">새 워크샵 만들기</h3>
            <form className="form-col" onSubmit={handleCreate}>
              <input
                required
                className="field"
                placeholder="워크샵 이름"
                value={form.workshopName}
                onChange={(e) => setForm({ ...form, workshopName: e.target.value })}
              />
              <input
                className="field"
                placeholder="아이콘 이미지 URL(선택)"
                value={form.workshopIconImage}
                onChange={(e) => setForm({ ...form, workshopIconImage: e.target.value })}
              />
              <textarea
                className="field"
                placeholder="설명(선택)"
                value={form.workshopDescription}
                onChange={(e) => setForm({ ...form, workshopDescription: e.target.value })}
              />
              <div className="form-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline-sm">
                  취소
                </button>
                <button type="submit" className="btn-primary-sm">
                  생성
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
}