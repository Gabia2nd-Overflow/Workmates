import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button"; // 기존 공용 Button
import { useDashboard } from "./Dashboard/DashboardContext";

export default function ScheduleButton({
  label = "스케줄",
  variant = "outline",
  size = "md",
  className,
  style,
}) {
  const navigate = useNavigate();
  const { currentWorkshopId } = useDashboard();

  const handleClick = () => {
    if (!currentWorkshopId) {
      window.alert("워크샵을 먼저 선택해야 합니다.");
      return;
    }
    navigate(`/schedules/${currentWorkshopId}/schedules`);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={!currentWorkshopId}
      className={className}
      style={style}
      title={currentWorkshopId ? "스케줄로 이동합니다." : "워크샵 선택 후 사용합니다."}
    >
      {label}
    </Button>
  );
}