import React from "react";
import { cn } from "../utils/cn";
import AuthButtons from "../Components/AuthButtons";
import { useNavigate } from "react-router-dom";


const Header = () => {
  const navigate = useNavigate();
  return (
    <header
  className={cn(
    "w-full h-[80px] flex items-center px-12 fixed top-0 left-0 z-50 shadow"
  )}
  style={{
    backgroundColor: "#b62547",
  }}
>
  {/* 좌측: 로고 */}
  <div className="flex items-center w-1/3">
    <div className="w-14 h-14 bg-white rounded-[15px] mr-4 flex items-center justify-center shadow overflow-hidden">
      <img
       onClick={() => navigate("/")}
        src="/img/logo.png"
        alt="로고"
        className="w-full h-full object-cover"
      />
    </div>
  </div>

  {/* 중앙: Workmates */}
  <div className="flex justify-center w-1/3">
    <span
      className="text-[42px] font-bold tracking-wide"
      style={{ color: "#FFB6C1" }}
    >
      Workmates
    </span>
  </div>

  {/* 우측: AuthButtons */}
  <div className="flex justify-end items-center w-1/3">
    <AuthButtons />
  </div>
</header>
  );
};

export default Header;
