import React from "react";
import { useAuth } from "../../providers/AuthProvider";
import { getSupabase } from "../../lib/supabaseClient";
import { Badge } from "../common/data/Badge";

// PUBLIC_INTERFACE
export function NotificationBell() {
  /** Shows unread notifications count; subscribes to user-specific realtime channel */
  const { user } = useAuth();
  const [count, setCount] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const listRef = React.useRef([]);

  React.useEffect(() => {
    if (!user) return undefined;
    const ch = getSupabase()
      .channel(`user_${user.id}`)
      .on("broadcast", { event: "notify" }, (payload) => {
        listRef.current = [{ id: Math.random(), ...payload.payload }, ...listRef.current].slice(0, 20);
        setCount((c) => c + 1);
      });
    ch.subscribe();
    return () => getSupabase().removeChannel(ch);
  }, [user]);

  if (!user) return null;
  return (
    <div style={{ position: "relative" }}>
      <button className="btn" aria-label="Notifications" onClick={() => setOpen((o) => !o)}>
        🔔
        {count > 0 && <Badge>{count}</Badge>}
      </button>
      {open && (
        <div className="glass-card" style={{ position: "absolute", right: 0, marginTop: 8, width: 280 }}>
          <strong style={{ display: "block", paddingBottom: 8 }}>Notifications</strong>
          <div style={{ display: "grid", gap: 8 }}>
            {listRef.current.length === 0 ? (
              <span>No notifications</span>
            ) : (
              listRef.current.map((n) => (
                <div key={n.id} className="glass-panel">
                  {n.title || "Update"}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
