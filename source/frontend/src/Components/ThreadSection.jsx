// src/components/ThreadSection.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function ThreadSection({ workshopId, threads, setThreads  }) {
  const navigate = useNavigate();
  const [creatingThread, setCreatingThread] = useState(false);
  const [threadName, setThreadName] = useState("");

const createThread = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(`/api/workshops/${workshopId}/threads`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: threadName }),
});


    if (!response.ok) {
      throw new Error(`서버 오류: ${response.status} - ${await response.text()}`);
    }

    const newThread = await response.json();
    setThreads((prev) => [...prev, newThread]);
    setThreadName("");
    setCreatingThread(false);
  } catch (error) {
    console.error("스레드 생성 중 오류:", error);
  }
};




  return (
    <div className="space-y-2 mt-4">
      {/* 스레드 헤더 */}
      <div className="flex items-center justify-between bg-pink-200 px-3 py-2 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-pink-400 rounded flex items-center justify-center text-white text-xs">
            📄
          </div>
          <span className="font-bold text-pink-800">스레드</span>
        </div>
        <button
          onClick={() => setCreatingThread((v) => !v)}
          className="text-pink-600 font-bold"
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
