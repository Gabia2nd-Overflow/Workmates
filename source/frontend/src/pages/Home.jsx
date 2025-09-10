// src/pages/Home.jsx

import Header from '../Components/Header';
import WorkshopButton from '../Components/WorkshopButton';
import UserFooter from '../Components/UserFooter';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MyWorkshopsPanel from "../Components/MyWorkshopsPanel";
import './Home.css';

const Home = () => {

  const navigate = useNavigate();
  
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

       {/* ⬇️ 우측 메인 콘텐츠 */}
       <main className="home__main">
          <p>메인 콘텐츠가 여기에 표시됩니다.</p>
          <WorkshopButton/>
        </main>
      </div>

      {/* 하단 고정 푸터 */}
      <UserFooter />
    </div>
  );
};

export default Home;
