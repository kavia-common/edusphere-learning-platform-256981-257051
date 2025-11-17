import React from "react";
import { GlassCard } from "../../components/common";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
export default function Pricing() {
  /** Subscription pricing page with plans linking to checkout */
  return (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
      <GlassCard>
        <h3>Starter</h3>
        <p>$9 / month</p>
        <Link to="/checkout?plan=starter" className="btn btn-primary">Choose</Link>
      </GlassCard>
      <GlassCard>
        <h3>Pro</h3>
        <p>$29 / month</p>
        <Link to="/checkout?plan=pro" className="btn btn-primary">Choose</Link>
      </GlassCard>
      <GlassCard>
        <h3>Team</h3>
        <p>$99 / month</p>
        <Link to="/checkout?plan=team" className="btn btn-primary">Choose</Link>
      </GlassCard>
    </div>
  );
}
