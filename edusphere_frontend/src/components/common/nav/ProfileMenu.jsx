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
