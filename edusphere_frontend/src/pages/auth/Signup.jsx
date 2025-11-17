import React from "react";
import { getSupabase } from "../../lib/supabaseClient";
import { GlassCard } from "../../components/common";

// PUBLIC_INTERFACE
export default function Signup() {
  /** Email/password signup */
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [msg, setMsg] = React.useState("");

  async function onSignup(e) {
    e.preventDefault();
    const { error } = await getSupabase().auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    setMsg(error ? error.message : "Check your email to confirm your account.");
  }

  return (
    <GlassCard as="form" onSubmit={onSignup} style={{ maxWidth: 420, margin: "40px auto" }}>
      <h2>Sign up</h2>
      <label>Email<input value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
      <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
      <button className="btn btn-primary" type="submit">Create account</button>
      {msg && <p>{msg}</p>}
    </GlassCard>
  );
}
