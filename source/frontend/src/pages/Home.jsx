// src/pages/Home.jsx

import Header from '../Components/Header';
import UserFooter from '../Components/UserFooter';
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import MyWorkshopsPanel from "../Components/MyWorkshopsPanel";
import WorkshopCards from "../Components/main_home/WorkshopCards";
import CreateWorkshopModalHost from "../Components/main_home/CreateWorkshopModalHost";
import Hello from "../Components/main_home/hello";
import './Home.css';

const Home = () => {

  const navigate = useNavigate();
  const { pathname } = useLocation();               // ★ 추가: 현재 경로 확인
  const isSettings = pathname.startsWith("/my/settings"); // ★ 추가: 설정 열림 여부
  const railRef = useRef(null);
  const drag = useRef({ active: false, startY: 0, startTop: 0, el: null });

  // home-rail 내부에서 실제 스크롤되는 엘리먼트를 찾아준다 (.mw-row가 있으면 그걸 사용)
  const getScroller = () => {
    const root = railRef.current;
    if (!root) return null;
    return root.querySelector(".mw-row") || root;
  }

  // 드래그 스크롤 핸들러
  const onMouseDown = (e) => {
    const el = getScroller();
    if (!el) return;
    drag.current = { active: true, startY: e.clientY, startTop: el.scrollTop, el };
    el.classList.add("dragging");
    e.preventDefault(); // 텍스트/이미지 드래그 방지
    // 드래그 중에는 전역으로 move/up을 감지 (엘리먼트 밖으로 나가도 계속 동작)
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", endDrag);
  };

  const onMouseMove = (e) => {
    const el = drag.current.el;
    if (!el || !drag.current.active) return;
    el.scrollTop = drag.current.startTop - (e.clientY - drag.current.startY);
  };

  const endDrag = () => {
    const el = railRef.current;
    drag.current.active = false;
    if (el) el.classList.remove("dragging");
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", endDrag);
  };
  
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
       <aside
        className="home-rail"
        ref={railRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onDragStart={(e) => e.preventDefault()}  // 이미지/텍스트 기본 드래그 방지
       >
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
