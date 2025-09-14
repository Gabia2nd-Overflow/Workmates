import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { workshopAPI } from "../services/api";
import "./MyWorkshopsPanel.css";
import MyWorkshopItem from "./MyWorkshopItem";

const WORKSHOP_ICON_SRC = "/img/workshop_icon.png";

export default function MyWorkshopsPanel() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [workshops, setWorkshops] = useState([]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setLoading(true);
        setErr(null);
        let data = null;
        if (typeof workshopAPI.mine === "function") {
          ({ data } = await workshopAPI.mine());
        } else if (typeof workshopAPI.listMine === "function") {
          ({ data } = await workshopAPI.listMine());
        } else {
          ({ data } = await workshopAPI.list());
        }
        if (!ignore) {
          const arr = Array.isArray(data) ? data : (data?.content || data?.items || []);
          setWorkshops(arr || []);
        }
      } catch (e) {
        if (!ignore) setErr(e);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, []);

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="mw-row">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="mw-card skeleton" key={i} />
          ))}
        </div>
      );
    }
    if (err) {
      return (
        <div className="mw-empty">
          <p>워크샵을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</p>
          <small className="mw-muted">{String(err?.message || err)}</small>
        </div>
      );
    }
    if (!workshops.length) {
      return (
        <div className="mw-empty">
          <p>참여 중인 워크샵이 없어요.</p>
          <small className="mw-muted">상단의 “새 워크샵”을 만들어 보세요.</small>
        </div>
      );
    }

    return (
      <div className="mw-row">
        {workshops.map((ws) => {
          // 다양한 id 대응
          const wsId =
            ws.id ?? ws.workshopId ?? ws.workshopID ?? ws.wid ?? ws.code;

          // 이름 후보 우선순위 (임시 문구 없이 "이름만")
          const wsName =
            [
              ws.name,
              ws.title,
              ws.workshopName,
              ws.workshopTitle,
              ws.workshop_name,
              ws.displayName,
              ws.projectName,
              ws.subject,
            ].map((v) => (typeof v === "string" ? v.trim() : ""))
             .find((v) => v.length > 0) || "";

          // 로고 후보 우선순위 (있으면 사용)
          const wsLogo =
            [
              ws.logoUrl,
              ws.logo,
              ws.iconUrl,
              ws.icon,
              ws.imageUrl,
              ws.thumbnail,
              ws.avatar,
              ws.picture,
            ].map((v) => (typeof v === "string" ? v.trim() : ""))
             .find((v) => v.length > 0) || null;

          return (
            <MyWorkshopItem
              key={wsId}
              logoSrc={wsLogo}        // 로고 전달 (없으면 컴포넌트 내 글자 배지)
              name={wsName}
              onClick={() => navigate(`/workshops/${wsId}`)}
            />
          );
        })}
      </div>
    );
  }, [loading, err, workshops, navigate]);

  return (
    <section className="mw-panel span-2">
      <header className="mw-head">
        <h3 className="mw-title">My Workshop</h3>
      </header>
      {content}
    </section>
  );
}