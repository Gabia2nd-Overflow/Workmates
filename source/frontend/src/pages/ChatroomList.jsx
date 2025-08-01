// src/pages/ChatroomList.jsx
import React, { useEffect, useState } from 'react';
import { chatroomAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ChatroomList = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    chatroomAPI.getChatrooms()
      .then(res => setRooms(res.data))
      .catch(err => console.error('채팅방 목록 조회 실패', err));
  }, []);

  return (
    <div className="flex h-screen">
      {/* 좌측 워크샵 목록 */}
      <aside className="w-72 bg-gray-100 border-r p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">워크샵</h2>
          <button
            onClick={() => navigate('/createchatrooms')}
            className="bg-blue-500 text-white text-sm px-2 py-1 rounded hover:bg-blue-600"
          >
            + 생성
          </button>
        </div>

        <ul className="space-y-2">
          {rooms.map(room => (
            <li
              key={room.id}
              className="p-3 bg-white border rounded cursor-pointer hover:bg-blue-50"
              onClick={() => navigate(`/chatrooms/${room.id}`)}
            >
              <div className="font-medium text-blue-700">{room.name}</div>
              <div className="text-xs text-gray-500 truncate">{room.description}</div>
            </li>
          ))}
        </ul>
      </aside>

      {/* 우측 안내 */}
      <main className="flex-1 flex items-center justify-center text-gray-400">
        워크샵을 선택하거나 생성해주세요
      </main>
    </div>
  );
};

export default ChatroomList;
