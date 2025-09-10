// src/pages/Home.jsx

import Header from '../Components/Header';
import WorkshopButton from '../Components/WorkshopButton';
import UserFooter from '../Components/UserFooter';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Home.css';

const Home = () => {

  const navigate = useNavigate();
  
  useEffect(() => {
    const user = localStorage.getItem("user");
    if(!user) {
      navigate("/login");
    }
  })

  return (
    <div className="page page--home"> {/* pt-[100px]: Header height 만큼 padding top */}

    {/* 상단바 영역 */}
    <Header />

      {/* 본문 영역 (비워둠) */}
      <main className="home__main">
        <WorkshopButton/>
      </main>

    {/* 하단바 영역 */}
    <UserFooter />
    </div>
  );
};

export default Home;
