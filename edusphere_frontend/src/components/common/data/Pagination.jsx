import React from "react";

// PUBLIC_INTERFACE
export function Pagination({ page, total, onPage }) {
  /** Simple pagination control */
  const prev = () => onPage(Math.max(1, page - 1));
  const next = () => onPage(Math.min(total, page + 1));
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <button className="btn" onClick={prev} disabled={page <= 1} aria-label="Previous page">
        ◀
      </button>
      <span>
        Page {page} of {total}
      </span>
      <button className="btn" onClick={next} disabled={page >= total} aria-label="Next page">
        ▶
      </button>
    </div>
  );
}
