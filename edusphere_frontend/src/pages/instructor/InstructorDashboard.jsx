import React from "react";
import { GlassCard } from "../../components/common";

// PUBLIC_INTERFACE
export default function InstructorDashboard() {
  /** Instructor dashboard shell */
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <GlassCard><h2>Course Builder</h2><p>Create and manage courses and lessons.</p></GlassCard>
      <GlassCard><h2>Gradebook</h2><p>Track submissions and grades.</p></GlassCard>
      <GlassCard><h2>Student Progress</h2><p>Monitor progress and engagement.</p></GlassCard>
    </div>
  );
}
