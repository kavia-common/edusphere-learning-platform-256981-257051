import React from "react";
import { GlassCard } from "../../components/common";
import { useAnalytics } from "../../hooks/useAnalytics";

/* PUBLIC_INTERFACE */
const AnalyticsDashboard = function AnalyticsDashboard() {
  /** Displays basic analytics metrics (placeholder) */
  const { capture } = useAnalytics();

  React.useEffect(() => {
    capture("analytics_viewed", { path: window.location.pathname });
  }, [capture]);

  return (
    <div
      style={{
        display: "grid",
        gap: 16,
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      }}
    >
      <GlassCard>
        <h3>Daily Active Users</h3>
        <div style={{ height: 120 }} className="glass-panel">
          Chart Placeholder
        </div>
      </GlassCard>
      <GlassCard>
        <h3>Course Completions</h3>
        <div style={{ height: 120 }} className="glass-panel">
          Chart Placeholder
        </div>
      </GlassCard>
      <GlassCard>
        <h3>Engagement</h3>
        <div style={{ height: 120 }} className="glass-panel">
          Chart Placeholder
        </div>
      </GlassCard>
    </div>
  );
};

export default AnalyticsDashboard;
