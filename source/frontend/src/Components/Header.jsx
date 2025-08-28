import React from "react";
import { cn } from "../utils/cn";
import AuthButtons from "../Components/AuthButtons";
import "./Header.css";

const Header = () => {
  return (
    <header className={cn("header")}>
      {/* 좌측: 로고 */}
      <div className="header__left">
        <div className="header__logo-box">
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