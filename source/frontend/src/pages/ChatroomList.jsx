// src/pages/ChatroomList.jsx
import React, { useEffect, useState } from 'react';
import { chatroomAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ChatroomList = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 채팅방 목록 불러오기
    chatroomAPI.getChatrooms()
      .then(res => setRooms(res.data))
      .catch(err => {
        console.error('채팅방 목록 조회 실패', err);
      });
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-lg font-bold mb-4">채팅방 목록</h2>
      <ul>
        {rooms.map(room => (
          <li key={room.id} className="mb-3 flex justify-between items-center">
            <span 
              className="cursor-pointer text-blue-600 hover:underline"
              onClick={() => navigate(`/chatrooms/${room.id}`)}
            >
              {room.name}
            </span>
            <span className="text-gray-500 text-sm">{room.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatroomList;
