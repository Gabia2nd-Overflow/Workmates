import { useState, useMemo } from "react";

export default function MyWorkshopItem({ logoSrc, name, onClick }) {
  // 로고 로드 실패 시 글자 배지로 폴백
  const [showLogo, setShowLogo] = useState(!!logoSrc); // CHANGED

  // 이름 첫 글자 (공백 제거, 한 글자만)
  const initial = useMemo(() => {
    const n = (name || "").trim();
    if (!n) return "?";
    return n[0]; // CHANGED (한글/숫자도 그대로)
  }, [name]);

  return (
    <button className="mw-card" onClick={onClick} type="button">
      <span className="mw-icon">
        {showLogo ? (
          <img
            src={logoSrc}
            alt=""
            onError={() => setShowLogo(false)} // CHANGED: 이미지 깨지면 글자 배지로 전환
          />
        ) : (
          <span className="mw-monogram">{initial}</span> // CHANGED
        )}
      </span>
      <span className="mw-name" title={name}>{name}</span>
    </button>
  );
}