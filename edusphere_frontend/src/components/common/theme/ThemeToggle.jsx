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
