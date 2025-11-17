import React from "react";

// PUBLIC_INTERFACE
export function IconButton({ label, icon, onClick }) {
  /** Accessible icon button */
  return (
    <button className="btn" aria-label={label} title={label} onClick={onClick}>
      <span aria-hidden>{icon}</span>
    </button>
  );
}
