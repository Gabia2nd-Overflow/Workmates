// src/pages/WorkshopDetail.jsx
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { loungeAPI, workshopAPI } from "../services/api";

export default function WorkshopDetail() {
  const { workshopId } = useParams();
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState(null);
  const [lounges, setLounges] = useState([]);
  const [creating, setCreating] = useState(false);
  const [loungeName, setLoungeName] = useState("");

  useEffect(() => {
    workshopAPI.get(workshopId).then(({ data }) => setWorkshop(data));
    loungeAPI.list(workshopId).then(({ data }) => setLounges(data));
  }, [workshopId]);

  const createLounge = async (e) => {
    e.preventDefault();
    const { data } = await loungeAPI.create(workshopId, { name: loungeName });
    setLounges((prev) => [...prev, data]);
    setLoungeName("");
    setCreating(false);
    navigate(`lounges/${data.id}`); // DTO가 id로 내려오게 맞춰둠 (LoungeDto.Response.id)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <div className="pt-[80px] pl-20 h-[calc(100vh-80px)] flex">
        {/* 좌측: 라운지 목록 */}
        <aside className="w-64 border-r p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold truncate" title={workshop?.workshopName}>
              {workshop?.workshopName || "Workshop"}
            </h3>
            <button onClick={() => setCreating((v) => !v)} className="text-sm px-2 py-1 border rounded">
              + 라운지
            </button>
          </div>

          {creating && (
            <form onSubmit={createLounge} className="flex gap-2 mb-3">
              <input
                className="border p-1 flex-1 rounded"
                value={loungeName}
                onChange={(e) => setLoungeName(e.target.value)}
                placeholder="라운지 이름"
                required
              />
              <button className="px-2 py-1 bg-black text-white rounded">생성</button>
            </form>
          )}

          <ul className="space-y-1">
            {lounges.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => navigate(`lounges/${l.id}`)}
                  className="w-full text-left px-2 py-1 rounded hover:bg-gray-100"
                >
                  {l.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* 우측: 라운지 상세 (메시지/파일) */}
        <section className="flex-1">
          <Outlet />
        </section>
      </div>
    </div>
  );
}