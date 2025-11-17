import React from "react";
import { GlassCard } from "../../components/common";

// PUBLIC_INTERFACE
export default function AdminDashboard() {
  /** Admin dashboard shell */
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <GlassCard><h2>User Management</h2><p>Assign roles and manage users.</p></GlassCard>
      <GlassCard><h2>Content Moderation</h2><p>Review and moderate content.</p></GlassCard>
      <GlassCard><h2>System Settings</h2><p>Configure system and feature flags.</p></GlassCard>
    </div>
  );
}
