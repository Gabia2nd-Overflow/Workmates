// src/pages/ChatroomList.jsx
import React, { useEffect, useState } from "react";
import { chatroomAPI } from "../services/api";
import ChatroomDetail from '../Components/LoungeDetail';

const ChatroomList = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  useEffect(() => {
    chatroomAPI
      .getChatrooms()
      .then((res) => setRooms(res.data))
      .catch((err) => console.error("워크샵 목록 조회 실패", err));
  }, []);

  return (
    <div className="flex h-screen">
      {/* 좌측 리스트 */}
      <aside className="w-72 bg-gray-100 border-r p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">워크샵</h2>
          <button
            className="bg-blue-500 text-white px-2 py-1 text-sm rounded"
            onClick={() => (window.location.href = "/createchatrooms")}
          >
            + 생성
          </button>
        </div>

        <ul className="space-y-2">
          {rooms.map((room) => (
            <li
              key={room.id}
              className={`p-3 border rounded cursor-pointer ${
                selectedRoomId === room.id ? "bg-blue-100" : "bg-white"
              } hover:bg-blue-50`}
              onClick={() => setSelectedRoomId(room.id)}
            >
              <div className="font-medium text-blue-700">{room.name}</div>
              <div className="text-xs text-gray-500 truncate">
                {room.description}
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {/* 우측 채팅 상세 */}
      <main className="flex-1">
        {selectedRoomId ? (
          <ChatroomDetail chatroomId={selectedRoomId} />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            워크샵을 선택해주세요
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatroomList;
