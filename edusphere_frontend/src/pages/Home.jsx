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
