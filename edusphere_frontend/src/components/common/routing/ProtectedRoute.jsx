import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../providers/AuthProvider";

/**
 * Role-based protected route wrapper for react-router v6.
 */
// PUBLIC_INTERFACE
export function ProtectedRoute({ roles }) {
  const { user, role, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/auth/login" replace />;
  if (roles && roles.length && role && !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
```

Explanation: Auth provider with Supabase and helpers (magic link, signup, reset)
````write file="edusphere-learning-platform-256981-257051/edusphere_frontend/src/providers/AuthProvider.jsx"
import React from "react";
import { getSupabase } from "../lib/supabaseClient";

const AuthContext = React.createContext(null);

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Supabase auth context provider */
  const [session, setSession] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [role, setRole] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const client = getSupabase();
    client.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
      if (data.session?.user) loadRole(data.session.user.id);
    });
    const { data: sub } = client.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) loadRole(s.user.id);
    });
    return () => sub?.subscription?.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadRole(userId) {
    try {
      const { data, error } = await getSupabase()
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();
      if (!error) setRole(data?.role || "student");
    } catch {
      setRole("student");
    }
  }

  async function signInWithMagicLink() {
    const email = window.prompt("Enter email for magic link:");
    if (!email) return;
    await getSupabase().auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    alert("Magic link sent. Please check your email.");
  }

  async function signOut() {
    await getSupabase().auth.signOut();
  }

  const value = React.useMemo(
    () => ({
      session,
      user,
      role,
      loading,
      signInWithMagicLink,
      signOut,
    }),
    [session, user, role, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Returns auth context */
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
```

Explanation: Feature flag hook
````write file="edusphere-learning-platform-256981-257051/edusphere_frontend/src/hooks/useFeatureFlag.js"
import { getEnv } from "../config/env";

// PUBLIC_INTERFACE
export function useFeatureFlag(key, defaultValue = false) {
  /** Returns feature flag value and experiments state */
  const env = getEnv();
  const enabled = key in env.FEATURE_FLAGS ? !!env.FEATURE_FLAGS[key] : defaultValue;
  return { enabled, experiments: !!env.EXPERIMENTS_ENABLED };
}
```

Explanation: Realtime hooks (channel and presence)
````write file="edusphere-learning-platform-256981-257051/edusphere_frontend/src/hooks/useRealtimeChannel.js"
import React from "react";
import { getSupabase } from "../lib/supabaseClient";

// PUBLIC_INTERFACE
export function useRealtimeChannel(topic, { onMessage } = {}) {
  /** Subscribes to a Supabase realtime channel, returns push helper and cleanup */
  const ref = React.useRef(null);
  React.useEffect(() => {
    const client = getSupabase();
    const channel = client.channel(topic);
    ref.current = channel;

    if (onMessage) {
      channel.on("broadcast", { event: "msg" }, (payload) => onMessage(payload));
    }

    channel.subscribe((status) => {
      // eslint-disable-next-line no-console
      console.log("[realtime] channel status", topic, status);
    });
    return () => {
      client.removeChannel(channel);
    };
  }, [topic, onMessage]);

  const send = React.useCallback((payload) => {
    ref.current?.send({ type: "broadcast", event: "msg", payload });
  }, []);

  return { send };
}
