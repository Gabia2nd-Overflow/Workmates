// UserFooter.jsx
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
          <button
            className="uf-btn"
            aria-label="설정"
            title="설정"
            onClick={() => {
              const m = window.location.pathname.match(
                /\/(?:workshops|schedules)\/(\d+)/
              );
              const wid = m?.[1];
              const target = wid
                ? `/workshops/${wid}/settings`
                : `/my/settings`;
              // 현재 위치를 state.from으로 함께 전달
              navigate(target, { state: { from: location.pathname } });
            }}
          >
            <img src="/img/btn_settings.png" alt="" />
          </button>
          <button className="uf-btn" aria-label="메일" title="메일">
            <img src="/img/btn_mail.png" alt="" />
          </button>
          <button
            className="uf-btn"
            aria-label="친구"
            title="친구"
            onClick={() => {
              const sp = new URLSearchParams(location.search);
              sp.set("friends", "open");
              navigate(`${location.pathname}?${sp.toString()}`, {
                replace: false,
              });
            }}
          >
            <img src="/img/btn_friends.png" alt="" />
          </button>
        </div>
      </div>
    </footer>
  );
}
