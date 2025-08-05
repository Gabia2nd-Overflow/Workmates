// src/pages/CreateChatroom.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatroomAPI } from '../services/api';

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">워크샵 생성</h2>

        <input
          type="text"
          placeholder="워크샵 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <textarea
          placeholder="설명 (선택)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full mb-4 p-2 border rounded"
        />

        <button
          onClick={handleCreate}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          생성하기
        </button>
      </div>
    </div>
  );
};

export default CreateChatroom;
