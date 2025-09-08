/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export const DashboardContext = createContext(null);

export default function DashboardProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasEverOpened, setHasEverOpened] = useState(
    () => window.sessionStorage.getItem("dashboardEverOpened") === "1"
  );
  const [currentWorkshopId, setCurrentWorkshopId] = useState(null);

  const open = () => {
    setIsOpen(true);
    if (!hasEverOpened) {
      setHasEverOpened(true);
      window.sessionStorage.setItem("dashboardEverOpened", "1");
    }
  };
  const close = () => setIsOpen(false);
  const toggle = () => (isOpen ? close() : open());

  // ESC로 닫기
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // body 스크롤 락 (단순/안전)
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const value = useMemo(
    () => ({
      isOpen,
      hasEverOpened,
      currentWorkshopId,
      setCurrentWorkshopId,
      open, close, toggle,
    }),
    [isOpen, hasEverOpened, currentWorkshopId]
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

// 훅도 이 파일에서 함께 export (한 파일 통합 운영)
export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}