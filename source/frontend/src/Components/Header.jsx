import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../utils/cn";
import "./Header.css";
import "../style/font.css"
import ScheduleButton from "./ScheduleButton";

const Header = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/'); // 첫 화면(루트 경로)으로 이동
  };


  return (
    <header className={cn("header")}>
      {/* 좌측: 로고 */}
      <div className="header__left">
        {/* <div className="header__logo-box" onClick={handleLogoClick}> */}
          {/* <img src="/img/logo.png" alt="로고" className="header__logo-img" /> */}
        {/* </div> */}
      </div>

      {/* 중앙: Workmates */}
      <div className="header__center">
        <span className="header__title">WorkMates</span>
      </div>

    </header>
  );
};

export default Header;
