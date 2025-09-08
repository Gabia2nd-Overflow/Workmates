// src/components/lounge/LoungeDetail.jsx
import React, { useEffect, useState, useRef } from "react";
import { data, useParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import FileUploadButton from "./FileUploadButton";
import { loungeAPI, messageAPI } from "../services/api";
import "./LoungeDetail.css"

export default function LoungeDetail() {
  const { workshopId, loungeId } = useParams();
  const [loungeName, setLoungeName] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editInput, setEditInput] = useState("");

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); }
    catch { return null; }
  })();
  const userId = user?.id ?? user?.userId ?? user?.username ?? null;

  const stompClient = useRef(null);
  const scrollRef = useRef(null);

  // === 초기 메시지 로드 (REST) ===
  useEffect(() => {
    if (!workshopId || !loungeId) return;
    messageAPI
      .list(workshopId, loungeId)
      .then(({ data }) => setMessages(Array.isArray(data) ? data : []))
      .catch(() => setMessages([]));
  }, [workshopId, loungeId]);

  useEffect(() => {
    if(!workshopId || !loungeId) return;
    loungeAPI
      .get(workshopId,loungeId)
      .then(({data}) => {
         setLoungeName(data?.name ?? data?.loungeName ?? null);
      })
      .catch(() => setLoungeName(null));
  }, [workshopId, loungeId]);
  // === WebSocket 연결 및 구독 (SockJS 미사용, 순수 WS) ===
  useEffect(() => {
    if (!workshopId || !loungeId) return;

    const client = new Client({
      brokerURL: import.meta.env.VITE_WS_URL || "ws://localhost:8080/ws-stomp",
      reconnectDelay: 5000,
      connectHeaders: (() => {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
      })(),
      // debug: (str) => console.log(str),
      onConnect: () => {
        const SUB_TOPIC = `/sub/workshops.${workshopId}.lounges.${loungeId}`;

        const sub = client.subscribe(SUB_TOPIC, (frame) => {
          const payload = JSON.parse(frame.body);
          const msg = payload?.message ?? payload;

          setMessages((prev) => {
            if (!msg || !msg.id) return prev;
            // 중복 방지
            return prev.some((m) => m.id === msg.id) ? prev : [...prev, msg];
          });
        });

        client._workmatesSub = sub;
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      try { client._workmatesSub?.unsubscribe(); } catch(e) {console.error(e)}
      client.deactivate();
    };
  }, [workshopId, loungeId]);

  // === 자동 스크롤 ===
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // === 메시지 전송 (WebSocket 발행) ===
  const handleSend = () => {
    if (!input.trim() || !stompClient.current || !workshopId || !loungeId) return;

    const PUB_DEST = `/pub/workshops.${workshopId}.lounges.${loungeId}.send`;

    stompClient.current.publish({
      destination: PUB_DEST,
      body: JSON.stringify({
        // ★ 백엔드에서 ChatSocketRequest가 writerId/workshopId/loungeId/content 를 쓸 수 있으므로 같이 보냄
        writerId: userId,
        workshopId: Number(workshopId),
        loungeId: Number(loungeId),
        content: input,
      }),
      headers: { "content-type": "application/json" },
    });

    setInput("");
  };

  // === 메시지 수정 (REST) ===
  const handleEdit = async (messageId) => {
    try {
      // 백엔드가 writerId를 요구하면 아래 같이, 아니라면 content만
      await messageAPI.edit(workshopId, loungeId, messageId, {
        writerId: userId,
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
       <div className="lounge-header">{loungeName ?? `라운지 #${loungeId}`}</div>

      {/* 메시지 영역 */}
      <div className="lounge-messages">
        {messages.map((msg) => (
          <div key={`${msg.id}-${msg.updatedAt || msg.writtenAt || ""}`} className="mb-3">
            <div className="lounge-msg-meta">
              <span>
                {/* ★ 백엔드 표준 필드명으로 표시 */}
                {msg.writerNickname ?? msg.writerId ?? "익명"}
                {String(msg.writerId) === String(userId) && (
                  <>
                    <button
                      onClick={() => {
                        setEditingMessageId(msg.id);
                        setEditInput(msg.content || "");
                      }}
                      className="btn-inline btn-inline--edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="btn-inline btn-inline--delete"
                    >
                      🗑️
                    </button>
                  </>
                )}
              </span>
              <span className="meta-time">
                {msg.writtenAt
                  ? new Date(msg.writtenAt).toLocaleTimeString([], {
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
                  className="textarea-sm"
                />
                <button onClick={() => handleEdit(msg.id)} className="btn btn--success-sm mt-1">
                  수정 완료
                </button>
              </div>
            ) : msg.type === "FILE" ? (
              <>
                <div className="file-note">📎 파일 업로드가 완료되었습니다.</div>
                <a
                  href={msg.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="file-link"
                >
                  {msg.fileName || "파일 열기"}
                </a>
              </>
            ) : (
              <div className="msg-content">{msg.content}</div>
            )}
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* 입력/파일 */}
      <div className="composer">
        <FileUploadButton
          workshopId={workshopId}
          loungeId={loungeId}
          userId={userId}
          stompClient={stompClient}
        />

        <textarea
          className="composer__input"
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

        <button onClick={handleSend} className="btn btn--primary">
          전송
        </button>
      </div>
    </div>
  );
}