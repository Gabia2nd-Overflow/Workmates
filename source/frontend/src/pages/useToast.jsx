import { useCallback, useState } from "react";

export default function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((message, type = "info", duration = 3000) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);
  const ToastPortal = useCallback(() => (
    <div style={{
      position: "fixed", top: 90, right: 24, zIndex: 1000, display: "flex", flexDirection: "column", gap: 8
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          padding: "10px 14px",
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,.12)",
          background: t.type === "error" ? "#ffe2e2" : t.type === "success" ? "#e3ffe8" : "#f2f2f2",
          color: "#222",
          minWidth: 220
        }}>
          {t.message}
        </div>
      ))}
    </div>
  ), [toasts]);

  return { show, ToastPortal };
}