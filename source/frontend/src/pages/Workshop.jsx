// src/pages/Chatroom.jsx
import { useState } from "react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";

function Workshop() {
  const [selectedWorkshopId, setSelectedWorkshopId] = useState(null);

  return (
    <div className="flex h-screen pt-[80px]">
      {/* 상단바 영역 */}
      <Header />
      {/* 좌측 사이드바 */}
      <Sidebar onSelect={setSelectedWorkshopId} />

      {/* 중앙 메인 화면 */}
      <div className="flex-1 ml-20 flex items-center justify-center">
        {selectedWorkshopId ? (
          <WorkshopDetail workshopId={selectedWorkshopId} />
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-pink-600 mb-2">
              WorkMates에 오신 것을 환영합니다!
            </h1>
            <p className="text-pink-500">
              서버를 생성하거나 참가하여 팀과 협업을 시작하세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Workshop;
