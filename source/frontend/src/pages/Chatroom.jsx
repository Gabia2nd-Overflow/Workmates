// src/pages/Chatroom.jsx
import React from 'react';

import { useNavigate } from 'react-router-dom';
import ChatroomList from './ChatroomList';

function Chatroom() {
    const navigate = useNavigate();
  return (
    <div>
      <button onClick={() => navigate('/createchatrooms')}>채팅방 생성</button>
      <ChatroomList/>
      
    </div>
  );
}

export default Chatroom;