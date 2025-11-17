import React from "react";

// PUBLIC_INTERFACE
export function DataTable({ columns, rows, getKey = (r) => r.id }) {
  /** Lightweight data table */
  return (
    <div className="glass-card" role="table" aria-label="Data table" style={{ padding: 0 }}>
      <div role="rowgroup" style={{ display: "grid", gridTemplateColumns: `repeat(${columns.length}, 1fr)`, gap: 0 }}>
        {columns.map((c) => (
          <div key={c.key} role="columnheader" style={{ padding: 12, borderBottom: "1px solid rgba(0,0,0,0.06)", fontWeight: 600 }}>
            {c.header}
          </div>
        ))}
      </div>
      <div role="rowgroup">
        {rows.map((r) => (
          <div key={getKey(r)} role="row" style={{ display: "grid", gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}>
            {columns.map((c) => (
              <div key={c.key} role="cell" style={{ padding: 12, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {c.render ? c.render(r[c.key], r) : String(r[c.key] ?? "")}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
