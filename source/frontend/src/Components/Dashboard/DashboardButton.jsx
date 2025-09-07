import React from "react";
import Button from "../Button";
import { useDashboard } from "../../context/DashboardContext";

export default function DashboardButton({ className = "" }) {
  const { toggle, currentWorkshopId } = useDashboard();

  const onClick = () => {
    if (!currentWorkshopId) {
      window.alert("워크샵을 먼저 선택하세요.");
      return;
    }
    toggle(); // 열려 있으면 닫기, 닫혀 있으면 열기
  };

  return (
    <Button variant="outline" size="md" className={className} onClick={onClick}>
      대시보드
    </Button>
  );
}