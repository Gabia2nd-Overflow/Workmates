// src/pages/CreateChatroom.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatroomAPI } from '../services/api';
import './CreateLounge.css';

const CreateChatroom = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!name.trim()) {
      alert('워크샵 이름을 입력하세요.');
      return;
    }

    try {
      const res = await chatroomAPI.createChatroom({ name, description });
      navigate(`/chatrooms/${res.data.id}`);
    } catch (err) {
      console.error('생성 실패', err);
    }
  };

  return (
    <div className="page page--create-lounge">
      <div className="create-lounge__card">
        <h2 className="create-lounge__title">워크샵 생성</h2>

        <input
          type="text"
          placeholder="워크샵 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="create-lounge__input"
        />

        <textarea
          placeholder="설명 (선택)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="create-lounge__textarea"
        />

        <button
          onClick={handleCreate}
          className="create-lounge__submit"
        >
          생성하기
        </button>
      </div>
    </div>
  );
};

export default CreateChatroom;
