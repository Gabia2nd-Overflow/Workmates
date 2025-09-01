// src/components/LoungeSection.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoungeSection({ workshopId, lounges, setLounges }) {
  const navigate = useNavigate();
  const [creatingLounge, setCreatingLounge] = useState(false);
  const [loungeName, setLoungeName] = useState("");

  const createLounge = async (e) => {
    e.preventDefault();
    try {
      const { data } = await fetch(`/api/workshops/${workshopId}/lounges`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: loungeName }),
      }).then((res) => res.json());

      setLounges((prev) => [...prev, data]);
      setLoungeName("");
      setCreatingLounge(false);
      navigate(`lounges/${data.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold">라운지</h4>
        <button
          onClick={() => setCreatingLounge((v) => !v)}
          className="text-sm px-2 py-1 border rounded"
        >
          + 라운지
        </button>
      </div>

      {creatingLounge && (
        <form onSubmit={createLounge} className="flex gap-2 mb-3">
          <input
            className="border p-1 flex-1 rounded"
            value={loungeName}
            onChange={(e) => setLoungeName(e.target.value)}
            placeholder="라운지 이름"
            required
          />
          <button className="px-2 py-1 bg-black text-white rounded">생성</button>
        </form>
      )}

      <ul className="space-y-1">
        {lounges.map((l) => (
          <li key={l.id}>
            <button
              onClick={() => navigate(`lounges/${l.id}`)}
              className="w-full text-left px-2 py-1 rounded hover:bg-gray-100"
            >
              {l.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
