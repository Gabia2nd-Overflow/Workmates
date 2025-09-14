import { useEffect, useState } from "react";
import "./hello.css";
import { authAPI } from "../../services/api"; // Components/main_home → ../.. → services/api

const LOGO_SRC = "/img/logo_op.png";

// 로컬 캐시에서 닉네임 읽기
function readCachedNickname() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const obj = JSON.parse(raw);
    return obj?.nickname || null;
  } catch {
    return null;
  }
}

export default function Hello() {
  const [nickname, setNickname] = useState(readCachedNickname());

  useEffect(() => {
    let alive = true;

    // 캐시에 없을 때만 프로필 조회
    if (!nickname && authAPI && typeof authAPI.me === "function") {
      authAPI
        .me()
        .then(({ data }) => {
          if (!alive) return;
          const nk = data?.nickname || data?.nick || data?.name || null;
          if (nk) setNickname(nk);
        })
        .catch(() => {
          /* 실패 시 조용히 무시 → '게스트' 표시 */
        });
    }

    return () => {
      alive = false;
    };
  }, [nickname]);

  const displayName = nickname || "게스트";

  return (
    <section className="hello">
      <div className="hello__card" role="region" aria-label="환영 인사">
        <img className="hello__logo" src={LOGO_SRC} alt="Workmates 로고" />
        <p className="hello__text">
          안녕하세요 <strong className="hello__name">{displayName}님</strong>,
          오늘도 좋은 하루 보내고 계신가요?
        </p>
      </div>
    </section>
  );
}