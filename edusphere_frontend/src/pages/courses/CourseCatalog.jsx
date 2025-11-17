import React from "react";
import { getSupabase } from "../../lib/supabaseClient";
import { GlassCard } from "../../components/common";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
export default function CourseCatalog() {
  /** Fetch and display courses */
  const [courses, setCourses] = React.useState(null);
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await getSupabase().from("courses").select("*").limit(20);
        if (mounted) setCourses(data || []);
      } catch {
        if (mounted) setCourses([]);
      }
    })();
    return () => (mounted = false);
  }, []);

  return (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
      {(courses || []).map((c) => (
        <GlassCard key={c.id}>
          <h3>{c.title || "Untitled course"}</h3>
          <p>{c.subtitle || "No description"}</p>
          <Link className="btn btn-primary" to={`/courses/${c.id}`}>Open</Link>
        </GlassCard>
      ))}
      {courses && courses.length === 0 && <GlassCard>No courses found.</GlassCard>}
      {!courses && <GlassCard>Loading...</GlassCard>}
    </div>
  );
}
