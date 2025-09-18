// UserFooter.jsx
import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
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
  console.log(`${window.location.origin}/api/files${url}`);
  return `${window.location.origin}/api/files${url}`;
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
      id: u?.id ?? u?.userId ?? u?.user_id ?? "",
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
/* localStorage에 사용자 정보 저장 */
function saveCachedUser(userData) {
  try {
    localStorage.setItem("user", JSON.stringify(userData));
  } catch (error) {
    console.warn("사용자 정보 저장 실패:", error);
  }
}

export default function UserFooter() {
  const cached = readCachedUser();
  const [user, setUser] = useState(
    cached ?? { id: "", nickname: "", email: "", profileImageUrl: FALLBACK_AVATAR }
  );
  
  // API 호출 중복 방지를 위한 ref
  const isLoadingRef = useRef(false);
  const lastUpdateRef = useRef(0);
  
  const navigate = useNavigate();
  const location = useLocation();

  // 사용자 정보 가져오기 함수 (중복 호출 방지)
  const fetchUserInfo = useCallback(async (forceUpdate = false) => {
    // 이미 로딩 중이거나, 5초 이내에 업데이트한 경우 스킵
    const now = Date.now();
    if (isLoadingRef.current || (!forceUpdate && now - lastUpdateRef.current < 5000)) {
      return;
    }
    
    isLoadingRef.current = true;
    
    try {
      const res = await authAPI.getMyInfo();
      const d = res?.data || {};
      const next = {
        id: d.id ?? d.userId ?? d.user_id ?? undefined,
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
      
      setUser((prev) => {
        const updated = mergeDefined(prev, next);
        // localStorage에도 업데이트
        saveCachedUser(updated);
        return updated;
      });
      
      lastUpdateRef.current = now;
    } catch (error) {
      console.warn("사용자 정보 가져오기 실패:", error);
    } finally {
      isLoadingRef.current = false;
    }
  }, []);

  // 초기 로드 (한 번만)
  useEffect(() => {
    fetchUserInfo();
  }, []); // 빈 배열로 한 번만 실행

  // localStorage 변경 감지 (다른 탭에서의 변경사항)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "user" && e.newValue) {
        try {
          const updatedUser = JSON.parse(e.newValue);
          const processedUser = {
            id: updatedUser.id ?? updatedUser.userId ?? updatedUser.user_id ?? "",
            nickname: updatedUser.nickname ?? updatedUser.name ?? updatedUser.userNickname ?? "",
            email: updatedUser.email ?? updatedUser.username ?? updatedUser.userEmail ?? "",
            profileImageUrl: resolveImageUrl(
              updatedUser.profileImageUrl ??
                updatedUser.profileImage ??
                updatedUser.avatarUrl ??
                updatedUser.imageUrl ??
                updatedUser.photoUrl ??
                ""
            ),
          };
          
          setUser(prev => {
            // 실제로 변경된 내용이 있는지 확인
            if (JSON.stringify(prev) !== JSON.stringify(processedUser)) {
              return processedUser;
            }
            return prev;
          });
        } catch (error) {
          console.warn("localStorage 데이터 파싱 실패:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 커스텀 이벤트 리스너 (다른 컴포넌트에서 사용자 정보 업데이트 알림)
  useEffect(() => {
    const handleUserUpdate = () => {
      fetchUserInfo(true); // 강제 업데이트
    };

    // 사용자 정보 관련 이벤트들 리스닝
    window.addEventListener("userInfoUpdated", handleUserUpdate);
    window.addEventListener("profileUpdated", handleUserUpdate);
    window.addEventListener("userDataChanged", handleUserUpdate);
    
    return () => {
      window.removeEventListener("userInfoUpdated", handleUserUpdate);
      window.removeEventListener("profileUpdated", handleUserUpdate);
      window.removeEventListener("userDataChanged", handleUserUpdate);
    };
  }, [fetchUserInfo]);

  // 페이지 포커스 시 업데이트 (너무 자주 호출되지 않도록 제한)
  useEffect(() => {
    let focusTimeout;
    
    const handleFocus = () => {
      // 포커스 이벤트가 너무 자주 발생하지 않도록 디바운싱
      clearTimeout(focusTimeout);
      focusTimeout = setTimeout(() => {
        fetchUserInfo();
      }, 1000);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        clearTimeout(focusTimeout);
        focusTimeout = setTimeout(() => {
          fetchUserInfo();
        }, 1000);
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      clearTimeout(focusTimeout);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchUserInfo]);

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
            console.log("user image url : " + user.profileImageUrl);
            console.log("current src " + e.currentTarget.src);
            e.currentTarget.src = FALLBACK_AVATAR;
          }}
        />
        {/* 닉네임/아이디 */}
        <div className="uf-col2stack">
          <div className="uf-nickname">{user.nickname || " "}</div>
          <div className="uf-email">@{user.id || " "}</div>
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