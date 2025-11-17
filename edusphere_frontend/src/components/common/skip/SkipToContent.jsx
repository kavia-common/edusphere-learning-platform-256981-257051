import React from "react";

// PUBLIC_INTERFACE
export function SkipToContent() {
  /** Accessible skip link to jump to main content */
  return (
    <a
      href="#main-content"
      className="visually-hidden-focusable"
      style={{
        position: "absolute",
        top: -1000,
        left: 0,
        background: "var(--color-surface)",
        padding: "8px 12px",
        borderRadius: 8,
        boxShadow: "var(--shadow-sm)",
      }}
      onFocus={(e) => {
        e.currentTarget.style.top = "8px";
        e.currentTarget.style.left = "8px";
      }}
      onBlur={(e) => {
        e.currentTarget.style.top = "-1000px";
        e.currentTarget.style.left = "0";
      }}
    >
      Skip to content
    </a>
  );
}
