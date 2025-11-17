import React from "react";
import { VisuallyHidden } from "../skip/VisuallyHidden";

/**
 * Accessible modal with focus trap and ESC to close.
 */
// PUBLIC_INTERFACE
export function Modal({ open, onClose, title = "Dialog", children }) {
  const ref = React.useRef(null);
  const lastFocused = React.useRef(null);

  React.useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
      if (e.key !== "Tab") return;
      // Focus trap
      const focusable = ref.current?.querySelectorAll("button, a, input, select, textarea, [tabindex]:not([tabindex='-1'])");
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    if (open) {
      lastFocused.current = document.activeElement;
      document.addEventListener("keydown", onKey);
      setTimeout(() => {
        ref.current?.querySelector("h2")?.focus();
      }, 0);
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      if (lastFocused.current) lastFocused.current.focus();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" className="glass-card" style={{ position: "fixed", inset: 20, margin: "auto", maxWidth: 680 }}>
      <div ref={ref}>
        <h2 tabIndex={-1} style={{ marginTop: 0 }}>{title}</h2>
        <button className="btn" onClick={onClose} style={{ position: "absolute", top: 10, right: 10 }}>
          <VisuallyHidden>Close</VisuallyHidden>
          ✖️
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
}
