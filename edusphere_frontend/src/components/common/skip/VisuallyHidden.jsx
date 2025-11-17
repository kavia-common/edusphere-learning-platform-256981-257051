import React from "react";

// PUBLIC_INTERFACE
export function VisuallyHidden({ children }) {
  /** Hides content visually while keeping it accessible to screen readers */
  return (
    <span
      style={{
        border: 0,
        clip: "rect(0 0 0 0)",
        height: "1px",
        margin: "-1px",
        overflow: "hidden",
        padding: 0,
        position: "absolute",
        whiteSpace: "nowrap",
        width: "1px",
      }}
    >
      {children}
    </span>
  );
}
```

Explanation: Theme toggle component
````write file="edusphere-learning-platform-256981-257051/edusphere_frontend/src/components/common/theme/ThemeToggle.jsx"
import React from "react";

// PUBLIC_INTERFACE
export function ThemeToggle() {
  /** Toggle data-theme attribute on documentElement */
  const [theme, setTheme] = React.useState(
    document.documentElement.getAttribute("data-theme") || "light"
  );

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <button
      className="btn"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
    >
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
```

Explanation: Navbar with profile and notifications placeholders
````write file="edusphere-learning-platform-256981-257051/edusphere_frontend/src/components/common/nav/Navbar.jsx"
import React from "react";
import { ThemeToggle } from "../theme/ThemeToggle";
import { ProfileMenu } from "./ProfileMenu";

// PUBLIC_INTERFACE
export function Navbar({ rightSlot }) {
  /** Top navigation bar with brand and actions */
  return (
    <header className="navbar glass-card" role="banner" aria-label="Main">
      <div className="brand" aria-label="EduSphere Home">
        <span style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #2563EB, #60A5FA)" }} />
        <span>EduSphere</span>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {rightSlot}
        <ThemeToggle />
        <ProfileMenu />
      </div>
    </header>
  );
}
```

Explanation: Sidebar with simple icon nav links
````write file="edusphere-learning-platform-256981-257051/edusphere_frontend/src/components/common/nav/Sidebar.jsx"
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
```

Explanation: Profile menu using Supabase auth
````write file="edusphere-learning-platform-256981-257051/edusphere_frontend/src/components/common/nav/ProfileMenu.jsx"
import React from "react";
import { useAuth } from "../../../providers/AuthProvider";

// PUBLIC_INTERFACE
export function ProfileMenu() {
  /** Profile dropdown with sign in/out depending on auth state */
  const { user, signOut, signInWithMagicLink } = useAuth();
  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef(null);

  React.useEffect(() => {
    function onDoc(e) {
      if (!open) return;
      if (buttonRef.current && !buttonRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, [open]);

  if (!user) {
    return (
      <button className="btn" onClick={signInWithMagicLink}>
        Sign in
      </button>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <button ref={buttonRef} className="btn" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {user.email}
      </button>
      {open && (
        <div role="menu" aria-label="Profile" className="glass-card" style={{ position: "absolute", right: 0, marginTop: 8, padding: 8 }}>
          <button className="btn" onClick={signOut} role="menuitem">
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
```

Explanation: Basic surface and inputs utilities
````write file="edusphere-learning-platform-256981-257051/edusphere_frontend/src/components/common/surfaces/GlassCard.jsx"
import React from "react";

// PUBLIC_INTERFACE
export function GlassCard({ children, as: Comp = "div", style, ...rest }) {
  /** Generic glassmorphism card container */
  return (
    <Comp className="glass-card" style={{ padding: 16, ...style }} {...rest}>
      {children}
    </Comp>
  );
}
