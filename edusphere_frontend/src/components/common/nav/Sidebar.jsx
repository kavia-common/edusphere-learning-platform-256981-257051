import React from "react";
import { NavLink } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  display: "flex",
  width: "48px",
  height: "48px",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 12,
  color: isActive ? "#fff" : "var(--color-text)",
  background: isActive ? "linear-gradient(180deg, rgba(37,99,235,.95), rgba(37,99,235,.8))" : "transparent",
  border: "1px solid rgba(0,0,0,0.06)",
});

const routes = [
  { to: "/", label: "Home", icon: "🏠" },
  { to: "/courses", label: "Courses", icon: "🎓" },
  { to: "/instructor", label: "Instructor", icon: "🧪" },
  { to: "/admin", label: "Admin", icon: "🛠️" },
  { to: "/analytics", label: "Analytics", icon: "📈" },
  { to: "/pricing", label: "Pricing", icon: "💳" },
];

// PUBLIC_INTERFACE
export function Sidebar() {
  /** Left sidebar with primary navigation */
  return (
    <nav className="sidebar" aria-label="Primary">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {routes.map((r) => (
          <NavLink key={r.to} to={r.to} style={linkStyle} title={r.label} aria-label={r.label}>
            <span aria-hidden>{r.icon}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
