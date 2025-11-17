import React from "react";
import { GlassCard } from "../../components/common";
import { useAnalytics } from "../../hooks/useAnalytics";

// PUBLIC_INTERFACE
export default function AnalyticsDashboard() {
  /** Displays basic analytics metrics (placeholder) */
  const { capture } = useAnalytics();
  React.useEffect(() => {
    capture("analytics_viewed", { path: window.location.pathname });
  }, [capture]);
  return (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
      <GlassCard><h3>Daily Active Users</h3><div style={{ height: 120 }} className="glass-panel">Chart Placeholder</div></GlassCard>
      <GlassCard><h3>Course Completions</h3><div style={{ height: 120 }} className="glass-panel">Chart Placeholder</div></GlassCard>
      <GlassCard><h3>Engagement</h3><div style={{ height: 120 }} className="glass-panel">Chart Placeholder</div></GlassCard>
    </div>
  );
}
```

Explanation: Payments UI (Pricing, Checkout) and BillingHistory
````write file="edusphere-learning-platform-256981-257051/edusphere_frontend/src/pages/payments/Pricing.jsx"
import React from "react";
import { GlassCard } from "../../components/common";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
export default function Pricing() {
  /** Subscription pricing page */
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
