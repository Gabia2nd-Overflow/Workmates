// src/pages/ChatroomDetail.jsx
import React, { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import FileUploadButton from "../Components/FileUploadButton";
import { messageAPI } from "../services/api";

function ChatroomDetail({ chatroomId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editInput, setEditInput] = useState("");
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

          // ✅ 중복 방지
          setMessages((prev) => {
            const exists = prev.some((msg) => msg.id === newMsg.id);
            return exists ? prev : [...prev, newMsg];
          });
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

  const handleEdit = async (messageId) => {
    try {
      await messageAPI.editMessage(chatroomId, messageId, {
        senderId: userId,
        content: editInput,
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, content: editInput } : msg
        )
      );
      setEditingMessageId(null);
      setEditInput("");
    } catch (error) {
      console.error("메시지 수정 실패", error);
    }
  };

  const handleDelete = async (messageId) => {
    try {
      await messageAPI.deleteMessage(chatroomId, messageId, {
        senderId: userId,
      });
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    } catch (error) {
      console.error("메시지 삭제 실패", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="bg-blue-600 text-white px-4 py-2 font-semibold">
        워크샵 #{chatroomId}
      </div>

      {/* 메시지 출력 영역 */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((msg) => (
          <div key={`${msg.id}-${msg.updatedAt || ""}`} className="mb-3">
            <div className="font-semibold text-blue-700 flex justify-between">
              <span>
                {msg.senderNickname}
                {msg.senderNickname === user.nickname && (
                  <>
                    <button
                      onClick={() => {
                        setEditingMessageId(msg.id);
                        setEditInput(msg.content);
                      }}
                      className="ml-2 text-xs text-gray-500 hover:underline"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="ml-1 text-xs text-red-500 hover:underline"
                    >
                      🗑️
                    </button>
                  </>
                )}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {editingMessageId === msg.id ? (
              <div>
                <textarea
                  value={editInput}
                  onChange={(e) => setEditInput(e.target.value)}
                  className="w-full border rounded p-1"
                />
                <button
                  onClick={() => handleEdit(msg.id)}
                  className="mt-1 text-sm text-white bg-green-500 px-2 py-1 rounded"
                >
                  수정 완료
                </button>
              </div>
            ) : msg.type === "FILE" ? (
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
        <FileUploadButton
          chatroomId={chatroomId}
          userId={userId}
          stompClient={stompClient}
        />

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
