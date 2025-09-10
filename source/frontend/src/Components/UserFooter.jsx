<<<<<<< HEAD
import React, { useEffect, useMemo, useState } from "react";
import "./UserFooter.css";
import { authAPI } from "../services/api";
import AuthButtons from "./AuthButtons";
=======
import React from "react";
import { cn } from "../utils/cn";
import { useNavigate } from "react-router-dom";
import "./UserFooter.css";
>>>>>>> fea3346 (차단 기능 일부 추가)

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

<<<<<<< HEAD
  return (
    <div className="user-footer">
      <div className="uf-grid">{/* grid 간격/열 정의는 CSS */}
        {/* 아바타 */}
        <img
          className="uf-avatar"
          src={user.profileImageUrl || FALLBACK_AVATAR}
          alt={altText}
          referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.src = FALLBACK_AVATAR; }}
        />

        {/* 닉네임/이메일 */}
        <div className="uf-col2stack">
          <div className="uf-nickname">{user.nickname || " "}</div>
          <div className="uf-email">{user.email || " "}</div>
        </div>
=======
const UserFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className={cn("user-footer")}>
      {/* 유저 프로필 */}
      <div className="user-footer__profile-row">
        <img src={user.avatar} alt="프로필" className="user-footer__avatar" />

        {/* 텍스트 컬럼 */}
        <div className="user-footer__textcol">
          {/* 닉네임 라인 + 전원 버튼 */}
          <div className="user-footer__nickname-row">
            <span className="user-footer__nickname">{user.nickname}</span>
            <button
              title="로그아웃"
              className="user-footer__power-btn"
              onClick={() => {
                /* TODO: 로그아웃 핸들러 */
              }}
            >
              <img
                src="/img/btn_power.png" /* public 폴더의 투명 PNG */
                alt="전원버튼"
                className="user-footer__power-icon"
              />
            </button>
          </div>
>>>>>>> fea3346 (차단 기능 일부 추가)

        {/* 전원 아이콘 닉네임 라인 중앙 맞추기 */}
        <AuthButtons
          mode="logout-icon"
          className="uf-power uf-power--align"           /* 기존 위치/정렬 재사용 */
          imgSrc="/img/btn_power.png"
          imgAlt=""                                      /* 장식 이미지이므로 빈 alt */
        />

        {/* 하단 버튼 */}
        <div className="uf-bottomrow">
          <button className="uf-btn" aria-label="설정" title="설정">
            {/* 이미지가 버튼 박스에 맞춰 리사이즈됨 */}
            <img src="/img/btn_settings.png" alt="" />
          </button>
          <button className="uf-btn" aria-label="메일" title="메일">
            <img src="/img/btn_mail.png" alt="" />
          </button>
          <button className="uf-btn" aria-label="친구" title="친구">
            <img src="/img/btn_friends.png" alt="" />
          </button>
        </div>
      </div>
<<<<<<< HEAD
    </div>
  );
}
=======

      {/* 하단 아이콘 버튼 */}
      <div className="user-footer__buttons">
        <button
          title="설정"
          className="user-footer__btn user-footer__btn--left"
        >
          <img
            src="/img/btn_settings.png"
            className="user-footer__btn-img"
            alt="설정버튼"
          />
        </button>
        <button
          title="메일"
          className="user-footer__btn user-footer__btn--center"
        >
          <img
            src="/img/btn_mail.png"
            className="user-footer__btn-img"
            alt="메일버튼"
          />
        </button>
        <button
          title="친구"
          className="user-footer__btn user-footer__btn--right"
          onClick={() => navigate("/mates/list")}
        >
          <img
            src="/img/btn_friends.png"
            className="user-footer__btn-img"
            alt="친구버튼"
          />
        </button>
      </div>
    </footer>
  );
};

export default UserFooter;
>>>>>>> fea3346 (차단 기능 일부 추가)
