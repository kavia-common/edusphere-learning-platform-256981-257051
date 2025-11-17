import React from "react";
import { getSupabase } from "../lib/supabaseClient";

// PUBLIC_INTERFACE
export function usePresence(topic, key) {
  /** Tracks presence within a Supabase channel */
  const [members, setMembers] = React.useState([]);
  React.useEffect(() => {
    const client = getSupabase();
    const channel = client.channel(topic, { config: { presence: { key } } });
    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      const users = Object.values(state).flat().map((s) => s);
      setMembers(users);
    });
    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({ key, online_at: new Date().toISOString() });
      }
    });
    return () => {
      client.removeChannel(channel);
    };
  }, [topic, key]);

  return { members };
}
```

Explanation: Analytics capture hook (queue and flush to table or edge function)
````write file="edusphere-learning-platform-256981-257051/edusphere_frontend/src/hooks/useAnalytics.js"
import React from "react";
import { getSupabase } from "../lib/supabaseClient";

// PUBLIC_INTERFACE
export function useAnalytics() {
  /** Queue analytics events and flush periodically to DB */
  const queueRef = React.useRef([]);
  const [enabled] = React.useState(true);

  const capture = React.useCallback((event, props = {}) => {
    queueRef.current.push({
      event,
      props,
      ts: new Date().toISOString(),
    });
  }, []);

  React.useEffect(() => {
    let active = true;
    async function flush() {
      if (!enabled || queueRef.current.length === 0) return;
      const batch = queueRef.current.splice(0, queueRef.current.length);
      try {
        await getSupabase().from("analytics_events").insert(batch);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("[analytics] flush failed, requeueing", e);
        queueRef.current.unshift(...batch);
      }
    }
    const id = setInterval(() => active && flush(), 5000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [enabled]);

  return { capture };
}
```

Explanation: NotificationBell and Center using Realtime user_{id} channel
````write file="edusphere-learning-platform-256981-257051/edusphere_frontend/src/components/notifications/NotificationBell.jsx"
import React from "react";
import { useAuth } from "../../providers/AuthProvider";
import { getSupabase } from "../../lib/supabaseClient";
import { Badge } from "../components_alias";

export { Badge } from "../common/data/Badge"; // alias to ease imports
// This indirection allows re-export without deep path in main imports
// eslint-disable-next-line
export const components_alias = null;

// PUBLIC_INTERFACE
export function NotificationBell() {
  /** Subscribes to user_{id} channel and shows unread count */
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
              listRef.current.map((n) => <div key={n.id} className="glass-panel">{n.title || "Update"}</div>)
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

Explanation: Basic pages (auth, courses, lesson player, instructor, admin, analytics, pricing/checkout, billing history, dashboard home)
````write file="edusphere-learning-platform-256981-257051/edusphere_frontend/src/pages/Home.jsx"
import React from "react";
import { GlassCard } from "../components/common";

// PUBLIC_INTERFACE
export default function Home() {
  /** Dashboard landing page with quick links */
  return (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
      <GlassCard><h3>Welcome to EduSphere</h3><p>Explore courses, track progress, and learn together in real time.</p></GlassCard>
      <GlassCard><h3>Continue Learning</h3><p>Your next lesson is ready. Jump back in!</p></GlassCard>
      <GlassCard><h3>Announcements</h3><p>No announcements yet.</p></GlassCard>
    </div>
  );
}
