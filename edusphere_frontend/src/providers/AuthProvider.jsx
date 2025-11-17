import React from "react";
import { getSupabase } from "../lib/supabaseClient";

const AuthContext = React.createContext(null);

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Supabase auth context provider: exposes {user, role, loading, signInWithMagicLink, signOut} */
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
  /** Hook to access auth context */
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
