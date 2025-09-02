// src/pages/Chatroom.jsx
import { useState } from "react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import "./Workshop.css";

function Workshop() {
  const [selectedWorkshopId, setSelectedWorkshopId] = useState(null);

  return (
    <div className="page page--workshop">
      {/* 상단바 영역 */}
      <Header />

      {/* 콘텐츠 래퍼 */}
      <div className="workshop__content">
      {/* 좌측 사이드바 */}
      <Sidebar onSelect={setSelectedWorkshopId} />

      {/* 중앙 메인 화면 */}
      <div className="workshop__main">
        {selectedWorkshopId ? (
          <WorkshopDetail workshopId={selectedWorkshopId} />
        ) : (
          <div className="workshop__welcome">
            <h1 className="workshop__welcome-title">
              WorkMates에 오신 것을 환영합니다!
            </h1>
            <p className="workshop__welcome-text">
              서버를 생성하거나 참가하여 팀과 협업을 시작하세요.
            </p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

export default Workshop;
