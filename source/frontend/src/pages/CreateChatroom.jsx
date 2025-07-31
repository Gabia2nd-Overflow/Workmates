// src/pages/CreateChatroom.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatroomAPI } from '../services/api';

function CreateChatroom() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!name.trim()) {
      alert('채팅방 이름을 입력해주세요.');
      return;
    }

    try {
    const response = await chatroomAPI.createChatroom({
      name,
      description,
    });

    navigate(`/chatrooms/${response.data.id}`);
  } catch (error) {
    console.error('생성 실패', error);
  }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>채팅방 생성</h2>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="채팅방 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: '300px', padding: '0.5rem' }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <textarea
          placeholder="설명 (선택)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: '300px', padding: '0.5rem' }}
        />
      </div>
      <button onClick={handleCreate} style={{ padding: '0.5rem 1rem' }}>
        생성
      </button>
    </div>
  );
}

export default CreateChatroom;
