import React from "react";
import { getSupabase } from "../../lib/supabaseClient";
import { GlassCard } from "../../components/common";

// PUBLIC_INTERFACE
export default function Login() {
  /** Email/password login and magic link sign-in */
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [msg, setMsg] = React.useState("");

  async function onLogin(e) {
    e.preventDefault();
    const { error } = await getSupabase().auth.signInWithPassword({ email, password });
    setMsg(error ? error.message : "Signed in!");
  }

  async function onMagic() {
    const { error } = await getSupabase().auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    setMsg(error ? error.message : "Magic link sent!");
  }

  return (
    <GlassCard as="form" onSubmit={onLogin} style={{ maxWidth: 420, margin: "40px auto" }}>
      <h2>Login</h2>
      <label>Email<input value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
      <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button className="btn btn-primary" type="submit">Sign in</button>
        <button className="btn" type="button" onClick={onMagic}>Magic link</button>
      </div>
      {msg && <p>{msg}</p>}
    </GlassCard>
  );
}
