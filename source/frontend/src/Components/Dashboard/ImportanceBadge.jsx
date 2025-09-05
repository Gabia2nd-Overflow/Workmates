import React from "react";
export default function ImportanceBadge({ level }) {
  const lv = (level || "").toLowerCase();
  const cls = lv === "high" ? "badge high" : lv === "medium" ? "badge medium" : "badge low";
  const label = lv ? lv.toUpperCase() : "LOW";
  return <span className={cls}>{label}</span>;
}