// src/pages/WorkshopDetail.jsx
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { loungeAPI, workshopAPI } from "../services/api";
import { threadAPI } from "../services/api";

export default function WorkshopDetail() {
  const { workshopId } = useParams();
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState(null);
  const [lounges, setLounges] = useState([]);
  const [threads, setThreads] = useState([]); // 스레드 목록을 저장할 상태
  const [creatingLounge, setCreatingLounge] = useState(false);
  const [creatingThread, setCreatingThread] = useState(false); // 스레드 생성 상태
  const [loungeName, setLoungeName] = useState("");
  const [threadName, setThreadName] = useState(""); // 스레드 이름 상태

  useEffect(() => {
    // 워크숍, 라운지, 스레드 데이터를 한 번에 불러옵니다.
    workshopAPI.get(workshopId).then(({ data }) => setWorkshop(data));
    loungeAPI.list(workshopId).then(({ data }) => setLounges(data));
    threadAPI.list(workshopId).then((data) => setThreads(data));
  }, [workshopId]);

  const createLounge = async (e) => {
    e.preventDefault();
    const { data } = await loungeAPI.create(workshopId, { name: loungeName });
    setLounges((prev) => [...prev, data]);
    setLoungeName("");
    setCreatingLounge(false);
    navigate(`lounges/${data.id}`);
  };

  // 스레드 생성 핸들러 함수
  const createThread = async (e) => {
    e.preventDefault();
    try {
      const { id, name, isDeleted, workshopId: newWorkshopId } = await threadAPI.create({
        name: threadName,
        workshopId: Number(workshopId),
      });
      // DTO 응답 객체를 사용해 threads 상태를 업데이트합니다.
      setThreads((prev) => [...prev, { id, name, isDeleted, workshopId: newWorkshopId }]);
      setThreadName("");
      setCreatingThread(false);
      navigate(`/posts/${id}`); 
    } catch (error) {
      console.error("스레드 생성 중 오류가 발생했습니다:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <div className="pt-[80px] pl-20 h-[calc(100vh-80px)] flex">
        {/* 좌측: 라운지 및 스레드 목록 */}
        <aside className="w-64 border-r p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold truncate" title={workshop?.workshopName}>
              {workshop?.workshopName || "Workshop"}
            </h3>
            <button onClick={() => setCreatingLounge((v) => !v)} className="text-sm px-2 py-1 border rounded">
              + 라운지
            </button>
          </div>

          {creatingLounge && (
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

          {/* 스레드 섹션 (수정된 부분) */}
          <div className="space-y-2 mt-4">
            {/* 스레드 헤더 */}
            <div className="flex items-center justify-between bg-pink-200 px-3 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-pink-400 rounded flex items-center justify-center text-white text-xs">
                  📄
                </div>
                <span className="font-bold text-pink-800">스레드</span>
              </div>
              <button onClick={() => setCreatingThread((v) => !v)} className="text-pink-600 font-bold">+</button>
            </div>

            {/* 스레드 생성 폼 (creatingThread 상태에 따라 보임/숨김) */}
            {creatingThread && (
              <form onSubmit={createThread} className="flex gap-2">
                <input
                  className="border p-1 flex-1 rounded"
                  value={threadName}
                  onChange={(e) => setThreadName(e.target.value)}
                  placeholder="스레드 이름"
                  required
                />
                <button className="px-2 py-1 bg-black text-white rounded">생성</button>

                
              </form>
            )}
            
            {/* 개별 스레드 목록 */}
            <ul className="space-y-1">
              {threads.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => navigate(`threads/${t.id}`)}
                    className="w-full text-left px-2 py-1 rounded hover:bg-gray-100"
                  >
                    {t.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        

        {/* 우측: 라운지 또는 스레드 상세 */}
        <section className="flex-1">
          <Outlet />
        </section>
      </div>
    </div>
  );
}



