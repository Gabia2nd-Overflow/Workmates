import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "./Button"; // 공용 Button
import { useDashboard } from "./Dashboard/DashboardContext";
import "./ScheduleButton.css"; // 전용 스타일

export default function ScheduleButton({
  label = "스케줄",
  variant = "outline",
  size = "md",
  className,
  style,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentWorkshopId } = useDashboard();

  const handleClick = () => {
    if (!currentWorkshopId) {
      window.alert("워크샵을 먼저 선택해야 합니다.");
      return;
    }
    navigate(`/schedules/${currentWorkshopId}/schedules`);
  };

  // 현재 경로가 해당 워크샵의 스케줄이면 선택 상태
  const isActive =
    !!currentWorkshopId &&
    location.pathname.startsWith(`/schedules/${currentWorkshopId}`);

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={!currentWorkshopId}
      className={`schedule-btn${className ? ` ${className}` : ""}`}
      style={style}
      title={currentWorkshopId ? "스케줄로 이동합니다." : "워크샵 선택 후 사용합니다."}
      data-active={isActive ? "true" : "false"}       // 선택 상태를 CSS에 전달
      aria-current={isActive ? "page" : undefined}    // 접근성 표준(선택)
    >
      {label}
    </Button>
  );
}