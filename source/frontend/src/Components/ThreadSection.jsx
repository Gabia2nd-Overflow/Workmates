import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { threadAPI } from "../services/api"; // <- api.js import

export default function ThreadSection({ workshopId, threads, setThreads }) {
  const navigate = useNavigate();
  const [creatingThread, setCreatingThread] = useState(false);
  const [threadName, setThreadName] = useState("");

  const createThread = async (e) => {
    e.preventDefault();
    try {
      // Axios 사용, JWT 자동 첨부
      const { data: newThread } = await threadAPI.create(workshopId, {
        name: threadName,
      });

      setThreads((prev) => [...prev, newThread]);
      setThreadName("");
      setCreatingThread(false);
    } catch (error) {
      console.error("스레드 생성 중 오류:", error.response?.data || error.message);
      alert("스레드 생성 실패: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="space-y-2 mt-4">
      {/* 스레드 헤더 */}
      <div className="flex items-center justify-between bg-blue-200 px-3 py-2 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-400 rounded flex items-center justify-center text-white text-xs">
            📄
          </div>
          <span className="font-bold text-blue-800">스레드</span>
        </div>
        <button
          onClick={() => setCreatingThread((v) => !v)}
          className="text-blue-600 font-bold"
        >
          +
        </button>
      </div>

      {/* 스레드 생성 폼 */}
      {creatingThread && (
        <form onSubmit={createThread} className="flex gap-2">
          <input
            className="border p-1 flex-1 rounded"
            value={threadName}
            onChange={(e) => setThreadName(e.target.value)}
            placeholder="스레드 이름"
            required
          />
          <button className="px-2 py-1 bg-black text-white rounded">생성</button>
        </form>
      )}

      {/* 스레드 목록 */}
      <ul className="space-y-1">
        {(Array.isArray(threads) ? threads : []).map((t) => (
          <li key={t.id}>
            <button
              onClick={() => navigate(`/workshops/${workshopId}/threads/${t.id}`)}
              className="w-full text-left px-2 py-1 rounded hover:bg-gray-100"
            >
              {t.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
