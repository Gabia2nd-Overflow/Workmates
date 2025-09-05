import React, { useMemo } from "react";

// KST(UTC+9) 기준 일자 번호로 변환 후 차이를 계산하는 경량 로직
const MS_DAY = 86400000;
const KST = 9 * 60 * 60 * 1000;

function dayNumberKST(ms) {
  // UTC epoch 기준으로 +9h 이동 후 일수
  return Math.floor((ms + KST) / MS_DAY);
}

export default function DayDiffLabel({ iso }) {
  const { dday, klass } = useMemo(() => {
    if (!iso) return { dday: null, klass: "" };
    const dueMs = Date.parse(iso);
    const nowMs = Date.now();
    const diffDays = dayNumberKST(dueMs) - dayNumberKST(nowMs);
    // 오늘 마감이면 0, 지났으면 음수, 남으면 양수
    const cls =
      diffDays < 0 ? "overdue" :
      diffDays <= 7 ? "imminent" : "";
    return { dday: diffDays, klass: cls };
  }, [iso]);

  if (dday === null) return null;
  const text = dday < 0 ? `D${dday}` : dday === 0 ? "D-DAY" : `D-${dday}`;
  return <span className={`dday ${klass}`}>{text}</span>;
}