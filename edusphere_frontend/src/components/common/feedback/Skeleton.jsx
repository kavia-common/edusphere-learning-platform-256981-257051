import React from "react";

// PUBLIC_INTERFACE
export function Skeleton({ width = "100%", height = 16, style }) {
  /** Loading skeleton shimmer block */
  return (
    <div
      className="glass-card"
      style={{
        width,
        height,
        padding: 0,
        background: "linear-gradient(90deg, rgba(0,0,0,0.06), rgba(255,255,255,0.35), rgba(0,0,0,0.06))",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.2s infinite",
        ...style,
      }}
    />
  );
}
