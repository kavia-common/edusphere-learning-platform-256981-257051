import React from "react";
import { useSearchParams } from "react-router-dom";
import { getSupabase } from "../../lib/supabaseClient";
import { GlassCard } from "../../components/common";
import { useToast } from "../../components/common/overlays/Toast";

// PUBLIC_INTERFACE
export default function Checkout() {
  /** Calls Supabase Edge Function create_payment_intent */
  const [params] = useSearchParams();
  const { addToast } = useToast();
  const [status, setStatus] = React.useState("");

  async function onCheckout() {
    try {
      const fn = getSupabase().functions.invoke;
      const { data, error } = await fn("create_payment_intent", {
        body: { plan: params.get("plan") || "starter" },
      });
      if (error) throw error;
      setStatus("Payment intent created");
      addToast(`Payment intent created: ${data?.id || "ok"}`, "success");
    } catch (e) {
      setStatus("Failed to create payment intent");
      addToast("Edge Function not provisioned or failed", "error");
    }
  }

  return (
    <GlassCard style={{ maxWidth: 560 }}>
      <h2>Checkout</h2>
      <p>Plan: {params.get("plan") || "starter"}</p>
      <button className="btn btn-primary" onClick={onCheckout}>Create payment intent</button>
      {status && <p>{status}</p>}
    </GlassCard>
  );
}
