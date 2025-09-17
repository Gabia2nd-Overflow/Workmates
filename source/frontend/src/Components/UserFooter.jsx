import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./UserFooter.css";

import { authAPI } from "../services/api";
import AuthButtons from "./AuthButtons";
import { cn } from "../utils/cn";

const FALLBACK_AVATAR = "/img/simple_user.png";

/* 이미지 URL 안전 처리 */
function resolveImageUrl(url) {
  if (!url) return FALLBACK_AVATAR;
  if (/^https?:\/\//i.test(url)) return url;
  return url;
}

/* 값이 있을 때만 덮어쓰기 */
function mergeDefined(base, incoming = {}) {
  const out = { ...base };
  Object.keys(incoming).forEach((k) => {
    const v = incoming[k];
    if (v !== undefined && v !== null && v !== "") out[k] = v;
  });
  return out;
}

/* localStorage user 프리로드(있으면 깜빡임 최소화) */
function readCachedUser() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const u = JSON.parse(raw);
    return {
      nickname: u?.nickname ?? u?.name ?? u?.userNickname ?? "",
      email: u?.email ?? u?.username ?? u?.userEmail ?? "",
      profileImageUrl: resolveImageUrl(
        u?.profileImageUrl ??
          u?.profileImage ??
          u?.avatarUrl ??
          u?.imageUrl ??
          u?.photoUrl ??
          ""
      ),
    };
  } catch {
    return null;
  }
}

// ===== 라우팅 유틸 =====
const getWorkshopIdFromPath = () => {
  const m = location.pathname.match(/\/(?:workshops|schedules)\/(\d+)/);
  return m?.[1];
};

// 현재 경로(쿼리 포함)를 from에 보관
const buildFromQuery = () => `${location.pathname}${location.search}`;

// 특정 basePath에 쿼리 셋을 붙여 완성 경로 생성
const buildQueryPath = (basePath, setObj) => {
  const sp = new URLSearchParams();
  Object.entries(setObj || {}).forEach(([k, v]) => {
    if (v === null || v === undefined) return;
    sp.set(k, v);
  });
  const q = sp.toString();
  return q ? `${basePath}?${q}` : basePath;
};

export default function UserFooter() {
  const cached = readCachedUser();
  const [user, setUser] = useState(
    cached ?? { nickname: "", email: "", profileImageUrl: FALLBACK_AVATAR }
  );
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await authAPI.getMyInfo();
        if (!alive) return;
        const d = res?.data || {};
        const next = {
          nickname: d.nickname ?? d.name ?? d.userNickname ?? undefined,
          email: d.email ?? d.username ?? d.userEmail ?? undefined,
          profileImageUrl: resolveImageUrl(
            d.profileImageUrl ??
              d.profileImage ??
              d.avatarUrl ??
              d.imageUrl ??
              d.photoUrl ??
              undefined
          ),
        };
        setUser((prev) => mergeDefined(prev, next));
      } catch {
        /* 실패해도 기존 표시 유지 */
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const altText = useMemo(
    () => `${user.nickname || "사용자"} 프로필 이미지`,
    [user.nickname]
  );

  return (
    <footer className={cn("user-footer")}>
      <div className="uf-grid">
        {/* 아바타 */}
        <img
          className="uf-avatar"
          src={user.profileImageUrl || FALLBACK_AVATAR}
          alt={altText}
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_AVATAR;
          }}
        />

        {/* 닉네임/이메일 */}
        <div className="uf-col2stack">
          <div className="uf-nickname">{user.nickname || " "}</div>
          <div className="uf-email">{user.email || " "}</div>
        </div>

        {/* 전원 아이콘(로그아웃) */}
        <AuthButtons
          mode="logout-icon"
          className="uf-power uf-power--align"
          imgSrc="/img/btn_power.png"
          imgAlt=""
        />

        {/* 하단 버튼 */}
        <div className="uf-bottomrow">
          {/* 마이페이지: 컨텍스트가 있으면 /workshops/:id/settings, 없으면 /my/settings
          from 쿼리에 현재 경로를 보존 */}
          <button
            className="uf-btn uf-btn--text"
            aria-label="마이페이지"
            title="마이페이지"
            onClick={() => {
              const wid = getWorkshopIdFromPath();
              const target = wid ? `/workshops/${wid}/settings` : `/my/settings`;
              const next = buildQueryPath(target, { from: buildFromQuery() });
              navigate(next);
            }}
          >
            마이페이지
          </button>

          {/* 메일: 라우트만 예약, from 쿼리로 복귀 경로 유지 */}
          <button
            className="uf-btn uf-btn--text"
            aria-label="메일"
            title="메일"
            onClick={() => {
              const next = buildQueryPath("/mail", { from: buildFromQuery() });
              navigate(next);
            }}
          >
            메일
          </button>

          {/* 친구: 현재 페이지 유지 + friends=open 토글(기존 로직 존중) */}
          <button
            className="uf-btn uf-btn--text"
            aria-label="친구"
            title="친구"
            onClick={() => {
              const sp = new URLSearchParams(location.search);
              sp.set("friends", "open");
              navigate(`${location.pathname}?${sp.toString()}`, { replace: false });
            }}
          >
            친구
          </button>
        </div>
      </div>
    </footer>
  );
}
