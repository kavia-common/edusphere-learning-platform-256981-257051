import React from "react";
import { ThemeToggle } from "../theme/ThemeToggle";
import { ProfileMenu } from "./ProfileMenu";

// PUBLIC_INTERFACE
export function Navbar({ rightSlot }) {
  /** Top navbar with brand "EduSphere" and actions */
  return (
    <header className="navbar glass-card" role="banner" aria-label="Main">
      <div className="brand" aria-label="EduSphere Home">
        <span style={{ width: 34, height: 34, borderRadius: 10, display: "inline-block", background: "linear-gradient(135deg, #2563EB, #60A5FA)" }} />
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
