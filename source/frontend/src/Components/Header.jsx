import React from "react";
import { useNavigate } from "react-router-dom"; // ← 추가
import { cn } from "../utils/cn";
import "./Header.css";
import DashboardButton from "./Dashboard/DashboardButton";
import ScheduleButton from "./ScheduleButton";

const Header = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/'); // 첫 화면(루트 경로)으로 이동
  };

  // 로그인 토큰 존재 여부로 표시 제어
  const isLoggedIn = !!localStorage.getItem("token");

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

      {/* 우측: ScheduleButtons + DashboardButton */}
      <div className="header__right">
        {isLoggedIn && (
        <>
            <ScheduleButton style={{ marginRight: 8 }} />
            <DashboardButton />
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
