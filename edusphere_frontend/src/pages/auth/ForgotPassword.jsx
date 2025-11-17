import React from "react";
import { getSupabase } from "../../lib/supabaseClient";
import { GlassCard } from "../../components/common";

// PUBLIC_INTERFACE
export default function ForgotPassword() {
  /** Request password reset email */
  const [email, setEmail] = React.useState("");
  const [msg, setMsg] = React.useState("");

  async function onSend(e) {
    e.preventDefault();
    const { error } = await getSupabase().auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    setMsg(error ? error.message : "Reset link sent!");
  }

  return (
    <GlassCard as="form" onSubmit={onSend} style={{ maxWidth: 420, margin: "40px auto" }}>
      <h2>Forgot password</h2>
      <label>Email<input value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
      <button className="btn btn-primary" type="submit">Send reset link</button>
      {msg && <p>{msg}</p>}
    </GlassCard>
  );
}
