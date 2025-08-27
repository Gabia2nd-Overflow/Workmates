// Sidebar.jsx
import { useEffect, useState } from "react";
import { workshopAPI } from "../services/api";

export default function Sidebar({ onSelect }) {
  const [workshops, setWorkshops] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ workshopName: "", workshopDescription: "" });

  useEffect(() => {
    workshopAPI.list().then(({ data }) => setWorkshops(data));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const { data } = await workshopAPI.create(form);
    setWorkshops((prev) => [...prev, data]);
    setForm({ workshopName: "", workshopDescription: "" });
    setShowModal(false);
  };

  return (
    <div className="w-20 bg-pink-100 flex flex-col items-center py-4">
      {/* 워크샵 아이콘들 */}
      {workshops.map((w) => (
        <button
          key={w.workshopId}
          onClick={() => onSelect(w.workshopId)}
          className="w-12 h-12 mb-2 rounded-full bg-pink-300 hover:bg-pink-400 flex items-center justify-center text-white font-bold"
        >
          {w.workshopName[0].toUpperCase()}
        </button>
      ))}

      {/* + 버튼 */}
      <button
        onClick={() => setShowModal(true)}
        className="w-12 h-12 rounded-full border-2 border-dashed border-pink-400 text-pink-400 hover:bg-pink-100"
      >
        +
      </button>

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="font-bold mb-4">새 워크샵 만들기</h2>
            <form className="flex flex-col gap-2" onSubmit={handleCreate}>
              <input
                className="border p-2"
                placeholder="워크샵 이름"
                value={form.workshopName}
                onChange={(e) => setForm({ ...form, workshopName: e.target.value })}
              />
              <textarea
                className="border p-2"
                placeholder="워크샵 설명"
                value={form.workshopDescription}
                onChange={(e) =>
                  setForm({ ...form, workshopDescription: e.target.value })
                }
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1 border rounded"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-pink-500 text-white rounded"
                >
                  생성
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
