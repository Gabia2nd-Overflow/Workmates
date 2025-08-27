// src/pages/WorkshopsPage.jsx
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";

export default function WorkshopsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* 헤더 패딩 + 사이드바 여백 */}
      <div className="pt-[80px] pl-20 h-[calc(100vh-80px)]">
        <Sidebar />
        <div className="h-full flex items-center justify-center text-gray-500">
          좌측에서 워크샵을 선택하거나 + 로 생성하세요.
        </div>
      </div>
    </div>
  );
}