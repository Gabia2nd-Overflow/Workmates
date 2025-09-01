import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import LoungeSection from "../Components/LoungeSection";
import ThreadSection from "../Components/ThreadSection";
import { loungeAPI, workshopAPI, threadAPI } from "../services/api";

export default function WorkshopDetail() {
  const { workshopId } = useParams();
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState(null);
  const [lounges, setLounges] = useState([]);
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    workshopAPI.get(workshopId).then(({ data }) => setWorkshop(data));
    loungeAPI.list(workshopId).then(({ data }) => setLounges(Array.isArray(data) ? data : []));
    threadAPI.list(workshopId)
      .then((res) => setThreads(Array.isArray(res.data) ? res.data : []));
  }, [workshopId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <div className="pt-[80px] pl-20 h-[calc(100vh-80px)] flex">
        <aside className="w-64 border-r p-4">
          <h3 className="font-bold truncate mb-3" title={workshop?.workshopName}>
            {workshop?.workshopName || "Workshop"}
          </h3>

          <LoungeSection workshopId={workshopId} lounges={lounges} setLounges={setLounges} />
          <ThreadSection workshopId={workshopId} threads={threads} setThreads={setThreads} />
        </aside>

        <section className="flex-1">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
