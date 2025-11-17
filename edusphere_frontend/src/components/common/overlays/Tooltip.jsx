import React from "react";

// PUBLIC_INTERFACE
export function Tooltip({ label, children }) {
  /** Simple hover/focus tooltip */
  const [open, setOpen] = React.useState(false);
  return (
    <span className="tooltip" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}>
      {children}
      {open && (
        <span role="tooltip" style={{ top: "calc(100% + 8px)" }}>
          {label}
        </span>
      )}
    </span>
  );
}
