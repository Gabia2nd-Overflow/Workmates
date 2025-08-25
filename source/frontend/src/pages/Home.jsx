// src/pages/Home.jsx

import Header from '../Components/Header';
import AuthButtons from '../Components/AuthButtons';
import ChatroomButton from '../Components/ChatroomButton';
import Chatroom from './Chatroom';
import UserFooter from '../Components/UserFooter';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-[80px]"> {/* pt-[100px]: Header height 만큼 padding top */}

    {/* 상단바 영역 */}
    <Header />

      {/* 본문 영역 (비워둠) */}
      <main className="p-8 text-center text-gray-400">
        <p>메인 콘텐츠가 여기에 표시됩니다.</p>
        <ChatroomButton/>
      </main>

    {/* 하단바 영역 */}
    <UserFooter />
    </div>
  );
};

export default Home;
