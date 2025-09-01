// src/pages/Home.jsx

import Header from '../Components/Header';
import WorkshopButton from '../Components/WorkshopButton';
import UserFooter from '../Components/UserFooter';
import './Home.css';

const Home = () => {
  return (
    <div className="page page--home"> {/* pt-[100px]: Header height 만큼 padding top */}

    {/* 상단바 영역 */}
    <Header />

      {/* 본문 영역 (비워둠) */}
      <main className="home__main">
        <p>메인 콘텐츠가 여기에 표시됩니다.</p>
        <WorkshopButton/>
      </main>

    {/* 하단바 영역 */}
    <UserFooter />
    </div>
  );
};

export default Home;
