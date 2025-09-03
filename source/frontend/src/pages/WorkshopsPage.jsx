// src/pages/WorkshopsPage.jsx
import Header from "../Components/Header";
import UserFooter from "../Components/UserFooter";
import Sidebar from "../Components/Sidebar";
import "./WorkshopsPage.css";

export default function WorkshopsPage() {
  return (
    <div className="page page--workshops">
      <Header />
      {/* 헤더 패딩 + 사이드바 여백 */}
      <div className="workshops__layout">
        <Sidebar />
        <div className="workshops__empty">
          좌측에서 워크샵을 선택하거나 + 로 생성하세요.
        </div>
        <UserFooter />
      </div>
    </div>
  );
}