import React from "react";

// PUBLIC_INTERFACE
export function Badge({ children, color = "primary" }) {
  /** Small badge for status or counts */
  const styles = {
    primary: { background: "rgba(37,99,235,0.15)", color: "#1e40af" },
    amber: { background: "rgba(245,158,11,0.15)", color: "#92400e" },
    success: { background: "rgba(16,185,129,0.15)", color: "#065f46" },
  };
  return (
    <span className="badge" style={styles[color] || styles.primary}>
      {children}
    </span>
  );
}
