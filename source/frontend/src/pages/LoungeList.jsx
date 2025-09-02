// src/pages/ChatroomList.jsx
import React, { useEffect, useState } from "react";
import { chatroomAPI } from "../services/api";
import ChatroomDetail from '../Components/LoungeDetail';
import './LoungeList.css';

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
    <div className="page page--chatroom-list">
      <div className="chatroom-list__layout">
      {/* 좌측 리스트 */}
      <aside className="chatroom-list__sidebar">
        <div className="chatroom-list__sidebar-bar">
          <h2 className="chatroom-list__title">워크샵</h2>
          <button
            className="chatroom-list__create-btn"
            onClick={() => (window.location.href = "/createchatrooms")}
          >
            + 생성
          </button>
        </div>

        <ul className="chatroom-list__list">
          {rooms.map((room) => (
            <li
              key={room.id}
              className={`chatroom-list__item ${
                selectedRoomId === room.id ? "chatroom-list__item--active" : "chatroom-list__item--inactive"
              } hover:bg-blue-50`}
              onClick={() => setSelectedRoomId(room.id)}
            >
              <div className="chatroom-list__room-nam">{room.name}</div>
              <div className="chatroom-list__room-desc">
                {room.description}
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {/* 우측 채팅 상세 */}
      <main className="chatroom-list__main">
        {selectedRoomId ? (
          <ChatroomDetail chatroomId={selectedRoomId} />
        ) : (
          <div className="chatroom-list__placeholder">
            워크샵을 선택해주세요
          </div>
        )}
      </main>
      </div>
    </div>
  );
};

export default ChatroomList;
