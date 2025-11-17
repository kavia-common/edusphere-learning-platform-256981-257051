import React from "react";
import { useParams, Link } from "react-router-dom";
import { getSupabase } from "../../lib/supabaseClient";
import { GlassCard } from "../../components/common";

// PUBLIC_INTERFACE
export default function CourseDetail() {
  /** Course overview with lessons list */
  const { id } = useParams();
  const [course, setCourse] = React.useState(null);
  const [lessons, setLessons] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      try {
        const { data } = await getSupabase().from("courses").select("*").eq("id", id).single();
        setCourse(data);
      } catch {
        setCourse(null);
      }
      try {
        const { data } = await getSupabase().from("lessons").select("*").eq("course_id", id).order("position", { ascending: true });
        setLessons(data || []);
      } catch {
        setLessons([]);
      }
    })();
  }, [id]);

  if (!course) return <GlassCard>Loading...</GlassCard>;
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <GlassCard><h2>{course.title}</h2><p>{course.subtitle}</p></GlassCard>
      <div style={{ display: "grid", gap: 12 }}>
        {lessons.map((l) => (
          <GlassCard key={l.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div><strong>Lesson {l.position}:</strong> {l.title}</div>
            <Link className="btn btn-primary" to={`/lessons/${l.id}`}>Play</Link>
          </GlassCard>
        ))}
        {lessons.length === 0 && <GlassCard>No lessons yet.</GlassCard>}
      </div>
    </div>
  );
}
