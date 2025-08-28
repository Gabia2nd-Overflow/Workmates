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
    <aside className="fixed left-0 top-[80px] w-20 h-[calc(100vh-80px)] bg-pink-50 border-r flex flex-col items-center py-4 gap-3 z-40">
      {/* 워크샵 아이콘 리스트 */}
      <div className="flex-1 w-full flex flex-col items-center overflow-y-auto">
        {workshops.map((w) => (
          <button
            key={w.workshopId}
            onClick={() => navigate(`/workshops/${w.workshopId}`)}
            className={`w-12 h-12 mb-2 rounded-full flex items-center justify-center text-white font-bold
                       ${location.pathname.includes(`/workshops/${w.workshopId}`) ? "bg-pink-500" : "bg-pink-300 hover:bg-pink-400"}`}
            title={w.workshopName}
          >
            {(w.workshopName || "?")[0].toUpperCase()}
          </button>
        ))}
      </div>

      {/* + 생성 버튼 */}
      <button
        onClick={() => setShowModal(true)}
        className="w-12 h-12 rounded-full border-2 border-dashed border-pink-400 text-pink-500 hover:bg-pink-100 text-xl leading-none"
        title="새 워크샵"
      >
        +
      </button>

      {/* 생성 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-[60] bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-xl w-96 p-6">
            <h3 className="text-lg font-bold mb-4">새 워크샵 만들기</h3>
            <form className="flex flex-col gap-3" onSubmit={handleCreate}>
              <input
                required
                className="border p-2 rounded"
                placeholder="워크샵 이름"
                value={form.workshopName}
                onChange={(e) => setForm({ ...form, workshopName: e.target.value })}
              />
              <input
                className="border p-2 rounded"
                placeholder="아이콘 이미지 URL(선택)"
                value={form.workshopIconImage}
                onChange={(e) => setForm({ ...form, workshopIconImage: e.target.value })}
              />
              <textarea
                className="border p-2 rounded"
                placeholder="설명(선택)"
                value={form.workshopDescription}
                onChange={(e) => setForm({ ...form, workshopDescription: e.target.value })}
              />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-3 py-1 border rounded">
                  취소
                </button>
                <button type="submit" className="px-3 py-1 bg-pink-600 text-white rounded">
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