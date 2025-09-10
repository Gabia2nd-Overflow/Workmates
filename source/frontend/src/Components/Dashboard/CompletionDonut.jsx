import React from "react";

export default function CompletionDonut({ total = 0, completed = 0, rate = 0 }) {
  const R = 60;                        // 바깥 테두리 기준 반지름
  const RIM = 3;                       // ★추가: 항상 보이는 얇은 테두리 두께
  const GAP = 0.6;                     // ★추가: 이음새(seam) 방지용 미세 간격
  const PATH_W = 12;                   // ★추가: 실제 진행 선 두께

  /* ★추가: 진행/트랙이 도는 실제 반지름(테두리 안쪽으로 살짝 들어오게) */
  const R_RING = R - RIM / 2 - GAP;
  const C_RING = 2 * Math.PI * R_RING;
  const safeTotal = Math.max(0, total);
  const safeCompleted = Math.min(safeTotal, Math.max(0, completed));
  const pct = safeTotal === 0 ? 0 : Math.max(0, Math.min(100, rate));
  const dash = (pct / 100) * C_RING;

  return (
    <div className="donut-wrap">
      <div style={{ position: "relative", width: 160, height: 160 }}>
        <svg width="160" height="160" viewBox="0 0 160 160">
          {/* 1) 바깥 얇은 테두리(끝까지 보임) */}
          <circle
            cx="80" cy="80" r={R}
            fill="none"
            stroke="var(--donut-rim, #BFE9E3)"
            strokeWidth={RIM}
          />

          {/* 2) 안쪽 트랙(연한 색으로 전체 링 표시) */}
          <circle
            cx="80" cy="80" r={R_RING}
            fill="none"
            stroke="var(--donut-track, rgba(46,211,198,.18))"
            strokeWidth={PATH_W}
          />

          {/* 3) 진행(두껍게, 테두리 안쪽에서만 채워짐) */}
          <circle
            cx="80" cy="80" r={R_RING}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={PATH_W}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${C_RING - dash}`}
            strokeDashoffset="-0.5"
            transform="rotate(-90 80 80)"
          />
        </svg>
        <div className="donut-center">
          <div style={{ textAlign: "center", lineHeight: 1.2 }}>
            <div>{safeCompleted} / {safeTotal}</div>
            <div style={{ fontSize: 20 }}>{Math.round(pct)}%</div>
          </div>
        </div>
      </div>
      <div>
        <div style={{ color: "#9ca3af", fontSize: 12, marginBottom: 6 }}>
          완료/전체 비율
        </div>
        <div style={{ fontSize: 14 }}>
          완료 {safeCompleted}건 · 전체 {safeTotal}건
        </div>
        <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 6 }}>
          완료율은 서버 제공 값을 그대로 표시합니다.
        </div>
      </div>
    </div>
  );
}