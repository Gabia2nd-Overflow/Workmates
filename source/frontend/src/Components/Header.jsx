import React from "react";
import { useNavigate } from "react-router-dom"; // ← 추가
import { cn } from "../utils/cn";
import AuthButtons from "../Components/AuthButtons";

const Header = () => {
  const navigate = useNavigate(); 

  const handleLogoClick = () => {
    navigate('/'); // 첫 화면(루트 경로)으로 이동
  };
  return (
    <header className={cn("header")}>
      {/* 좌측: 로고 */}
      <div className="header__left">
        <div className="header__logo-box" onClick={handleLogoClick}>
          <img src="/img/logo.png" alt="로고" className="header__logo-img" />
        </div>
      </div>

      {/* 중앙: Workmates */}
      <div className="header__center">
        <span className="header__title">Workmates</span>
      </div>

      {/* 우측: AuthButtons */}
      <div className="header__right">
        <AuthButtons />
      </div>
    </header>
  );
};

export default Header;
