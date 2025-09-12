import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "../utils/cn";
import { workshopAPI } from "../services/api";
import "./Header.css";
import DashboardButton from "./Dashboard/DashboardButton";
import ScheduleButton from "./ScheduleButton";

export default function Header_Workshop() {
  const navigate = useNavigate();
  const { workshopId } = useParams();
  const [ws, setWs] = useState(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        let resp, data;

        if (typeof workshopAPI.get === "function") {
          resp = await workshopAPI.get(workshopId);
          data = resp?.data;
        } else if (typeof workshopAPI.detail === "function") {
          resp = await workshopAPI.detail(workshopId);
          data = resp?.data;
        } else if (typeof workshopAPI.fetch === "function") {
          resp = await workshopAPI.fetch(workshopId);
          data = resp?.data;
        } else if (typeof workshopAPI.list === "function") {
          resp = await workshopAPI.list();
          const arr = Array.isArray(resp?.data) ? resp.data : (resp?.data?.items || resp?.data?.content || []);
          data = (arr || []).find(d =>
            String(d?.id ?? d?.workshopId ?? d?.wid ?? d?.code) === String(workshopId)
          );
        }

        if (alive) setWs(data || null);
      } catch {
        if (alive) setWs(null);
      }
    }

    load();
    return () => { alive = false; };
  }, [workshopId]);

  // 이름/로고 우선순위 (MyWorkshopsPanel과 동일)
  const wsName = useMemo(() => {
    return ([
      ws?.name, ws?.title, ws?.workshopName, ws?.workshopTitle,
      ws?.workshop_name, ws?.displayName, ws?.projectName, ws?.subject,
    ].map(v => (typeof v === "string" ? v.trim() : ""))
     .find(v => v.length > 0)) || "";
  }, [ws]);

  const wsLogo = useMemo(() => {
    return ([
      ws?.logoUrl, ws?.logo, ws?.iconUrl, ws?.icon,
      ws?.imageUrl, ws?.thumbnail, ws?.avatar, ws?.picture,
    ].map(v => (typeof v === "string" ? v.trim() : ""))
     .find(v => v.length > 0)) || null;
  }, [ws]);

  const firstLetter = (wsName || "W").trim().charAt(0).toUpperCase();
  const handleHome = () => navigate("/");
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <header className={cn("header")}>
      <div className="header__left">
        <div className="header__logo-box" onClick={handleHome} role="button" aria-label="홈으로 이동">
          {wsLogo ? (
            <img src={wsLogo} alt={wsName || "Workshop"} className="header__logo-img" />
          ) : (
            <div className="header__logo-fallback" aria-hidden="true">{firstLetter}</div>
          )}
        </div>
      </div>

      <div className="header__center">
        <span
          className="header__title header__title--workshop"
          title={wsName || "Workshop"}
        >
          {wsName || "Workshop"}
        </span>
      </div>

      <div className="header__right">
        {isLoggedIn && (
          <>
            <ScheduleButton style={{ marginRight: 8 }} />
            <DashboardButton />
          </>
        )}
      </div>
    </header>
  );
}