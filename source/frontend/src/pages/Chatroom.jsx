// src/pages/Chatroom.jsx
import React from 'react';
import CreateChatroom from './CreateChatroom';
import { useNavigate } from 'react-router-dom';

function Chatroom() {
    const navigate = useNavigate();
  return (
    <div>
      <button onClick={() => navigate('/chatrooms')}>채팅방 목록 보기</button>
      <CreateChatroom/>
      
    </div>
  );
}

export default Chatroom;