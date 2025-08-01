// src/pages/ChatroomDetail.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

function ChatroomDetail() {
  const { id: chatroomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const stompClient = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/chatrooms/${chatroomId}/messages`)
      .then(res => res.json())
      .then(data => setMessages(data));
  }, [chatroomId]);

  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8080/ws-stomp",
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/sub/chatrooms.${chatroomId}`, (message) => {
          const newMsg = JSON.parse(message.body);
          setMessages(prev => [...prev, newMsg]);
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
      body: JSON.stringify({
        chatroomId,
        senderId: userId,
        content: input,
      }),
    });
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* 헤더 */}
      <header className="bg-blue-600 text-white px-4 py-3 text-lg font-semibold">
        워크샵 #{chatroomId}
      </header>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div key={index} className="mb-3">
            <span className="font-semibold text-blue-800">
              {msg.senderNickname || "익명"}
            </span>
            <span className="ml-2 text-sm text-gray-500">
              {new Date(msg.createdAt).toLocaleTimeString()}
            </span>
            <div className="ml-1">{msg.content}</div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* 입력창 */}
      <div className="p-3 border-t bg-white flex items-center">
        <textarea
          className="flex-1 resize-none border rounded p-2 mr-2 text-sm"
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
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          전송
        </button>
      </div>
    </div>
  );
}

export default ChatroomDetail;
