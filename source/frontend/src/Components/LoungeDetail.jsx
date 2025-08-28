// src/components/lounge/LoungeDetail.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import FileUploadButton from "./FileUploadButton";
import { messageAPI } from "../services/api";

export default function LoungeDetail() {
  const { workshopId, loungeId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editInput, setEditInput] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const stompClient = useRef(null);
  const scrollRef = useRef(null);

  // === 초기 메시지 로드 (REST) ===
  useEffect(() => {
    if (!workshopId || !loungeId) return;
    messageAPI
      .list(workshopId, loungeId)
      .then(({ data }) => setMessages(data ?? []))
      .catch(() => setMessages([]));
  }, [workshopId, loungeId]);

  // === WebSocket 연결 및 구독 (SockJS 미사용, 순수 WS) ===
  useEffect(() => {
    if (!workshopId || !loungeId) return;

    const client = new Client({
      // HTTPS이면 wss:// 로 바꾸세요.
      brokerURL: import.meta.env.VITE_WS_URL || "ws://localhost:8080/ws-stomp",
      reconnectDelay: 5000,
      // JWT 쓰면 여기에 Authorization 넣기
      connectHeaders: (() => {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
      })(),
      // 로그 보고 싶으면 켜기
      // debug: (str) => console.log(str),
      onConnect: () => {
        // ✅ 서버 브로드캐스트 목적지에 맞춰 구독 경로 통일 (dot 경로)
        const SUB_TOPIC = `/sub/workshops.${workshopId}.lounges.${loungeId}`;

        const sub = client.subscribe(SUB_TOPIC, (frame) => {
          // 서버가 { type, message } 형태로 주는 경우와, 곧바로 메시지 객체를 주는 경우 모두 대응
          const payload = JSON.parse(frame.body);
          const msg = payload?.message ?? payload;

          setMessages((prev) => {
            if (!msg || !msg.id) return prev;
            // 중복 방지
            return prev.some((m) => m.id === msg.id) ? prev : [...prev, msg];
          });
        });

        // clean-up 시 해제
        client._workmatesSub = sub;
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      try {
        client._workmatesSub?.unsubscribe();
      } catch {
        console.error("에러발생.")
      }
        client.deactivate();
      
    };
  }, [workshopId, loungeId]);

  // === 자동 스크롤 ===
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // === 메시지 전송 (WebSocket 발행) ===
  const handleSend = () => {
    if (!input.trim() || !stompClient.current || !workshopId || !loungeId)
      return;

    // ✅ 서버 @MessageMapping("/workshops.{workshopId}.lounges.{loungeId}.send") 와 1:1 매칭
    const PUB_DEST = `/pub/workshops.${workshopId}.lounges.${loungeId}.send`;

    stompClient.current.publish({
      destination: PUB_DEST,
      body: JSON.stringify({
        // 컨트롤러가 body를 MessageDto.SendMessageRequest(body)로 받음 → 필드명 맞추기
        // 백엔드 DTO가 writerId 라면 writerId로, senderId라면 senderId로!
        writerId: userId, // ← 백엔드가 writerId를 받는다면 이대로. (senderId 사용 시 키 이름 변경)
        content: input,
      }),
      headers: { "content-type": "application/json" },
    });

    setInput("");
  };

  // === 메시지 수정 (REST) ===
  const handleEdit = async (messageId) => {
    try {
      await messageAPI.edit(workshopId, loungeId, messageId, {
        // ⚠️ 백엔드 REST가 senderId/ writerId 중 무엇을 받는지 확인.
        // 기존 문서에선 senderId 사용 예시가 많았음. 필요 시 writerId로 변경.
        senderId: userId,
        content: editInput,
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, content: editInput } : m))
      );
      setEditingMessageId(null);
      setEditInput("");
    } catch (e) {
      console.error("메시지 수정 실패", e);
    }
  };

  // === 메시지 삭제 (REST) ===
  const handleDelete = async (messageId) => {
    try {
      await messageAPI.remove(workshopId, loungeId, messageId);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } catch (e) {
      console.error("메시지 삭제 실패", e);
    }
  };
  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="bg-blue-600 text-white px-4 py-2 font-semibold">
        라운지 #{loungeId}
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((msg) => (
          <div key={`${msg.id}-${msg.updatedAt || ""}`} className="mb-3">
            <div className="font-semibold text-blue-700 flex justify-between">
              <span>
                {msg.senderNickname ?? msg.senderId}
                {msg.senderId === userId && (
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
                {msg.createdAt
                  ? new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
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
              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                {msg.content}
              </div>
            )}
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* 입력/파일 */}
      <div className="p-3 border-t bg-white flex items-center">
        {/* ⬇ FileUploadButton 내부도 chatroomId → (workshopId, loungeId)로 변경 필요 */}
        <FileUploadButton
          workshopId={workshopId}
          loungeId={loungeId}
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
