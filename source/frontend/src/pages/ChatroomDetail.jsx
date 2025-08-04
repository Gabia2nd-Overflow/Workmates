// src/pages/ChatroomDetail.jsx
import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import FileUploadButton from "../Components/FileUploadButton";

function ChatroomDetail({ chatroomId }) {
  // 👈 변경됨
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const stompClient = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!chatroomId) return;
    fetch(`http://localhost:8080/api/chatrooms/${chatroomId}/messages`)
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, [chatroomId]);

  useEffect(() => {
    if (!chatroomId) return;
    const client = new Client({
      brokerURL: "ws://localhost:8080/ws-stomp",
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/sub/chatrooms.${chatroomId}`, (message) => {
          const newMsg = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMsg]);
        });
      },
    });
    client.activate();
    stompClient.current = client;
    return () => client.deactivate();
  }, [chatroomId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    stompClient.current.publish({
      destination: "/pub/chat.send",
      body: JSON.stringify({ chatroomId, senderId: userId, content: input }),
    });
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="bg-blue-600 text-white px-4 py-2 font-semibold">
        워크샵 #{chatroomId}
      </div>

      {/* 메시지 출력 영역 */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-3">
            <div className="font-semibold text-blue-700">
              {msg.senderNickname}
            </div>

            {msg.type === "FILE" ? (
              <>
                <div className="text-sm text-gray-600">
                  📎 파일 업로드가 완료되었습니다.
                </div>
                <a
                  href={msg.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline text-sm"
                >
                  {msg.fileName || "파일 열기"}
                </a>
              </>
            ) : (
              <div className="text-sm text-gray-600">{msg.content}</div>
            )}
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* 입력창 + 파일 버튼 */}
      <div className="p-3 border-t bg-white flex items-center">
        {/* 📎 파일 버튼은 여기 */}
        <FileUploadButton
          chatroomId={chatroomId}
          userId={userId}
          stompClient={stompClient}
        />

        {/* 메시지 입력 */}
        <textarea
          className="flex-1 border p-2 rounded mr-2"
          rows={2}
          placeholder="메시지를 입력하세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        {/* 전송 버튼 */}
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          전송
        </button>
      </div>
    </div>
  );
}

export default ChatroomDetail;
