import { Outlet, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import LoungeSection from "../Components/LoungeSection";
import ThreadSection from "../Components/ThreadSection";
import { loungeAPI, workshopAPI, threadAPI } from "../services/api";
import "./WorkShopDetail.css";

export default function WorkshopDetail() {
  const { workshopId } = useParams();
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
    <div className="page page--workshop-detail">
      <Header />
      <Sidebar />
      <div className="wsd__layout">
        <aside className="wsd__sidebar">
          <h3 className="wsd__title" title={workshop?.workshopName}>
            {workshop?.workshopName || "Workshop"}
          </h3>

          <LoungeSection workshopId={workshopId} lounges={lounges} setLounges={setLounges} />
          <ThreadSection workshopId={workshopId} threads={threads} setThreads={setThreads} />
        </aside>

        <section className="wsd__content">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
