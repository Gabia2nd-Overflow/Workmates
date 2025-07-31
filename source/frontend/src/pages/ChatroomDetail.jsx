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

  useEffect(() => {
    // REST로 기존 메시지 불러오기
    fetch(`http://localhost:8080/api/chatrooms/${chatroomId}/messages`)
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, [chatroomId]);

  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8080/ws-stomp",
      debug: console.log,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ WebSocket Connected");

        // ✅ 구독 경로 설정
        client.subscribe(`/sub/chatrooms.${chatroomId}`, (message) => {
          const newMsg = JSON.parse(message.body);
          console.log("📩 새 메시지 수신:", newMsg);
          setMessages((prev) => [...prev, newMsg]);
        });
      },
      onStompError: (frame) => {
        console.error("❌ STOMP Error", frame);
      },
    });

    client.activate();
    stompClient.current = client; // ✅ 이거 중요합니다!

    return () => {
      client.deactivate();
    };
  }, [chatroomId]);

  const handleSend = () => {
    if (!input.trim()) return;
    stompClient.current.publish({
      destination: "/pub/chat.send",
      body: JSON.stringify({
        chatroomId: chatroomId,
        senderId: userId,
        content: input,
      }),
    });
    setInput("");
  };
  const formatDate = (str) => {
    if (!str) return "";
    const date = new Date(str);
    return date.toLocaleString(); // → 예: 2025. 7. 31. 오후 5:37:01
  };
  return (
    <div>
      <h2>채팅방 {chatroomId} 메시지</h2>
      <div
        style={{
          minHeight: "300px",
          border: "1px solid #eee",
          marginBottom: 12,
        }}
      >
        {messages.map((msg, i) => (
          <div key={i}>
            <b>{msg.senderNickname || msg.senderName || "익명"}</b>:{" "}
            {msg.content}
            <span style={{ color: "#aaa", marginLeft: 8, fontSize: 12 }}>
              {formatDate(msg.createdAt)}
            </span>
          </div>
        ))}
      </div>
      <textarea
        style={{ width: "80%" }}
        rows={2}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder="메시지를 입력하세요..."
      />
      <button onClick={handleSend} style={{ marginLeft: 8 }}>
        전송
      </button>
    </div>
  );
}

export default ChatroomDetail;
