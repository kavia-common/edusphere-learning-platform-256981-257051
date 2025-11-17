import React from "react";
import { getSupabase } from "../lib/supabaseClient";

// PUBLIC_INTERFACE
export function useAnalytics() {
  /**
   * Queue analytics events and flush periodically to Supabase table 'analytics_events'.
   * Safe no-op if table/policies are not configured; errors are swallowed and retried later.
   */
  const queueRef = React.useRef([]);

  const capture = React.useCallback((event, props = {}) => {
    queueRef.current.push({
      event,
      props,
      ts: new Date().toISOString(),
    });
  }, []);

  React.useEffect(() => {
    let active = true;

    async function flush() {
      if (queueRef.current.length === 0) return;
      const batch = queueRef.current.splice(0, queueRef.current.length);
      try {
        const client = getSupabase();
        await client.from("analytics_events").insert(batch);
      } catch {
        // Best-effort; requeue on failure
        queueRef.current.unshift(...batch);
      }
    }

    const id = setInterval(() => {
      if (active) flush();
    }, 5000);

    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  return { capture };
}
