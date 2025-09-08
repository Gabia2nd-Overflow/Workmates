import React, { useEffect, useMemo, useState } from "react";
import { DashboardContext } from "./DashboardContext";

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

  // 열릴 때 body 스크롤 락
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = prev || "";
    return () => { document.body.style.overflow = prev || ""; };
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