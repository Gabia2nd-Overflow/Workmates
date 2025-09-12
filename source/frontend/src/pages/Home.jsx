// src/pages/Home.jsx

import Header from '../Components/Header';
import UserFooter from '../Components/UserFooter';
import { useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import MyWorkshopsPanel from "../Components/MyWorkshopsPanel";
import WorkshopCards from "../Components/main_home/WorkshopCards";
import CreateWorkshopModalHost from "../Components/main_home/CreateWorkshopModalHost";
import Hello from "../Components/main_home/hello";
import './Home.css';

const Home = () => {

  const navigate = useNavigate();
  const { pathname } = useLocation();               // ★ 추가: 현재 경로 확인
  const isSettings = pathname.startsWith("/my/settings"); // ★ 추가: 설정 열림 여부
  
  useEffect(() => {
    const user = localStorage.getItem("user");
    if(!user) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="page page--home">
      {/* 상단 고정 헤더 */}
      <Header />

      {/* 헤더/푸터에 가려지지 않는 스크롤 영역 */}
      <div className="home-scroll">
        {/* ⬇️ 좌측 폭이 UserFooter와 동일한 레일 */}
       <aside className="home-rail">
         <MyWorkshopsPanel />
       </aside>

       {/* 메인 콘텐츠 */}
       <main className="home__main">
        <Outlet /> {/* ★ 추가 */}

          {/* 기본 홈 콘텐츠 (설정이 열려있을 때는 감춤) */}
          {!isSettings && (
            <div className="home-default">
              <Hello />
              <WorkshopCards />
              <CreateWorkshopModalHost />
            </div>
          )}
        </main>
      </div>

      {/* 하단 고정 푸터 */}
      <UserFooter />
    </div>
  );
};

export default Home;
