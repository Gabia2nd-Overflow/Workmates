import React, { useEffect, useMemo, useState } from "react";
import "./UserFooter.css";
import { authAPI } from "../services/api";

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
    <div className="user-footer">
      <div className="uf-grid">{/* ★ grid 간격/열 정의는 CSS로 이동 */}
        {/* 아바타 */}
        <img
          className="uf-avatar"
          src={user.profileImageUrl || FALLBACK_AVATAR}
          alt={altText}
          referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.src = FALLBACK_AVATAR; }}
        />

        {/* ★ CHANGED: 닉네임/이메일을 col2 한 셀에서 세로 스택 */}
        <div className="uf-col2stack">
          <div className="uf-nickname">{user.nickname || " "}</div>
          <div className="uf-email">{user.email || " "}</div>
        </div>

        {/* ★ CHANGED: 전원 아이콘 수직 중앙 + 1px 미세보정 */}
        <button className="uf-power uf-power--align" aria-label="전원" title="전원">
          <img className="uf-power-icon" src="/img/btn_power.png" alt="" />
        </button>

        {/* ★ CHANGED: 하단 버튼 행 — 좌우 64px 대칭 그리드 */}
        <div className="uf-bottomrow">
          <button className="uf-btn uf-btn--settings" aria-label="설정" title="설정" />
          <button className="uf-btn uf-btn--mail" aria-label="메일" title="메일" />
          <button className="uf-btn uf-btn--friends" aria-label="친구" title="친구" />
        </div>
      </div>
    </div>
  );
}