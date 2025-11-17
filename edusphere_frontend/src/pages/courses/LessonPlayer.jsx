import React from "react";
import { useParams } from "react-router-dom";
import { getSupabase, getStorage } from "../../lib/supabaseClient";
import { GlassCard } from "../../components/common";

// PUBLIC_INTERFACE
export default function LessonPlayer() {
  /** Plays lesson video using signed URL; shows notes/discussion placeholders */
  const { id } = useParams();
  const [lesson, setLesson] = React.useState(null);
  const [videoUrl, setVideoUrl] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      try {
        const { data } = await getSupabase().from("lessons").select("*").eq("id", id).single();
        setLesson(data);
        if (data?.video_path) {
          // signed URL from storage bucket "lesson-media"
          const { data: urlData, error } = await getStorage().from("lesson-media").createSignedUrl(data.video_path, 3600);
          if (!error) setVideoUrl(urlData.signedUrl);
        }
      } catch {
        setLesson(null);
      }
    })();
  }, [id]);

  if (!lesson) return <GlassCard>Loading...</GlassCard>;
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <GlassCard>
        <h2>{lesson.title}</h2>
        {videoUrl ? (
          <video controls style={{ width: "100%", borderRadius: 12 }}>
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : (
          <div className="glass-panel">No video available. Upload to storage bucket "lesson-media".</div>
        )}
      </GlassCard>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
        <GlassCard><h3>Notes (Realtime)</h3><p>Collaborative notes coming soon.</p></GlassCard>
        <GlassCard><h3>Discussion (Realtime)</h3><p>Live thread updates coming soon.</p></GlassCard>
      </div>
    </div>
  );
}
```

Explanation: Instructor and Admin basic pages (stubs to satisfy routing and acceptance)
````write file="edusphere-learning-platform-256981-257051/edusphere_frontend/src/pages/instructor/InstructorDashboard.jsx"
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
