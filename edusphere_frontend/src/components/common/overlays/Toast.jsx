import React from "react";

const ToastContext = React.createContext(null);

// PUBLIC_INTERFACE
export function ToastProvider({ children }) {
  /** Global toast provider */
  const [toasts, setToasts] = React.useState([]);
  const addToast = (message, variant = "info", timeout = 3500) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, variant }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), timeout);
  };
  const value = React.useMemo(() => ({ addToast }), []);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" aria-atomic="true" style={{ position: "fixed", bottom: 16, right: 16, display: "grid", gap: 8 }}>
        {toasts.map((t) => (
          <div key={t.id} className="glass-card" style={{ padding: "10px 12px", borderLeft: `4px solid ${variantColor(t.variant)}` }}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function variantColor(v) {
  switch (v) {
    case "success":
      return "#10B981";
    case "error":
      return "#EF4444";
    default:
      return "#2563EB";
  }
}

// PUBLIC_INTERFACE
export function useToast() {
  /** Hook to push toast messages */
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
