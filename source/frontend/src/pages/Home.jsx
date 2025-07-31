// src/pages/Home.jsx

import AuthButtons from '../Components/AuthButtons';
import ChatroomButton from '../Components/ChatroomButton';
import Chatroom from './Chatroom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 바 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">🏠 Workmates</h1>
            <AuthButtons />
          </div>
        </div>
      </header>

      {/* 본문 영역 (비워둠) */}
      <main className="p-8 text-center text-gray-400">
        <p>메인 콘텐츠가 여기에 표시됩니다.</p>
        <ChatroomButton/>
      </main>
    </div>
  );
};

export default Home;
