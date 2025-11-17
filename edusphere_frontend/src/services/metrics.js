import { getSupabase } from '../lib/supabaseClient';

/**
 * Metrics configuration to avoid hardcoding table/view names in logic.
 * Adjust these names to match your Supabase schema if different.
 */
export const METRICS_CONFIG = {
  // Table or view for courses
  coursesTable: 'courses',
  // Table for analytics events (expects event_name and created_at/ts)
  analyticsEventsTable: 'analytics_events',
  // Optional table for presence/active users if you maintain a presence list
  presenceTable: 'user_presence',
  // Fallback strategy for active users: recent activity window in minutes
  activeWindowMinutes: 15,
  // Event name used to count recent completions
  completionEventName: 'completion',
  // Recent completion window in minutes
  completionWindowMinutes: 1440, // 24 hours
};

/**
 * Small utility to coerce a count result safely.
 */
function safeCount(val) {
  if (val === null || val === undefined) return 0;
  const num = Number(val);
  return Number.isNaN(num) ? 0 : num;
}

/**
 * Return an ISO timestamp string for "now - minutes".
 */
function isoMinutesAgo(minutes) {
  const d = new Date(Date.now() - minutes * 60 * 1000);
  return d.toISOString();
}



/**
 * PUBLIC_INTERFACE
 * Initialize channels for realtime updates for metrics.
 * Subscribes to:
 * - Presence changes or activity events to infer active users
 * - Analytics events for completions
 * 
 * @param {Object} options
 * @param {(delta: Partial<{activeLearners: number, recentCompletions: number}>) => void} options.onChange - callback with partial metric updates
 * @param {AbortSignal} [options.signal] - optional signal to cancel setup early
 * @returns {() => void} cleanup function to unsubscribe channels
 */
export function subscribeToMetrics({ onChange, signal } = {}) {
  const client = getSupabase?.();
  /** Gracefully handle if supabase isn't configured */
  if (!client) {
    // eslint-disable-next-line no-console
    console.warn('Supabase client is not initialized. Realtime metrics disabled.');
    return () => {};
  }

  let presenceChannel = null;
  let completionsChannel = null;

  // Try presence table if available
  try {
    presenceChannel = client
      .channel('realtime-presence-metrics')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: METRICS_CONFIG.presenceTable,
        },
        async () => {
          // On any presence change, recompute active users quickly
          try {
            const active = await fetchActiveLearnersCount();
            onChange?.({ activeLearners: active });
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Active learners realtime update error:', err?.message || err);
          }
        }
      )
      .subscribe(status => {
        // eslint-disable-next-line no-console
        if (process.env.REACT_APP_LOG_LEVEL === 'debug') console.debug('Presence channel status:', status);
      });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Presence realtime channel unavailable:', e?.message || e);
  }

  // Subscribe to completions events on analytics_events (insert events)
  try {
    completionsChannel = client
      .channel('realtime-completions-metrics')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: METRICS_CONFIG.analyticsEventsTable,
          // Filter server-side to reduce noise if supported:
          // filter: `event_name=eq.${METRICS_CONFIG.completionEventName}` // Not all environments support 'filter' here; we will filter client-side
        },
        async (payload) => {
          try {
            // Validate payload minimally and filter client-side for event_name
            const row = payload?.new || {};
            if (row?.event_name === METRICS_CONFIG.completionEventName) {
              const recent = await fetchRecentCompletionsCount();
              onChange?.({ recentCompletions: recent });
            }
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Recent completions realtime update error:', err?.message || err);
          }
        }
      )
      .subscribe(status => {
        // eslint-disable-next-line no-console
        if (process.env.REACT_APP_LOG_LEVEL === 'debug') console.debug('Completions channel status:', status);
      });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Completions realtime channel unavailable:', e?.message || e);
  }

  if (signal?.aborted) {
    presenceChannel && client.removeChannel(presenceChannel);
    completionsChannel && client.removeChannel(completionsChannel);
    return () => {};
  }

  return () => {
    try {
      presenceChannel && client.removeChannel(presenceChannel);
      completionsChannel && client.removeChannel(completionsChannel);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Error cleaning up realtime channels:', e?.message || e);
    }
  };
}

/**
 * PUBLIC_INTERFACE
 * Fetch count of total courses.
 * @returns {Promise<number>}
 */
export async function fetchCoursesCount() {
  const client = getSupabase?.();
  if (!client) return 0;
  try {
    const { count, error } = await client
      .from(METRICS_CONFIG.coursesTable)
      .select('*', { count: 'exact', head: true });

    if (error) {
      // eslint-disable-next-line no-console
      console.error('fetchCoursesCount error:', error.message);
      return 0;
    }
    return safeCount(count);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('fetchCoursesCount exception:', e?.message || e);
    return 0;
  }
}

/**
 * PUBLIC_INTERFACE
 * Fetch count of active learners using presence table if exists, otherwise fallback to recent activity window from analytics_events.
 * @returns {Promise<number>}
 */
export async function fetchActiveLearnersCount() {
  const client = getSupabase?.();
  if (!client) return 0;

  // First attempt presence table count (distinct user_id)
  try {
    const { error: presenceErr } = await client
      .from(METRICS_CONFIG.presenceTable)
      .select('user_id', { count: 'exact', head: true });

    if (!presenceErr) {
      // If no error, we have a table; supabase returns count in a header
      // But since we used head:true, count should be available
      // To get count when head:true, supabase returns count in the response object
      // However, many clients require select with count and not using head to retrieve data; we can fallback to no-head
      const retry = async () => {
        const { data, error, count } = await client
          .from(METRICS_CONFIG.presenceTable)
          .select('user_id', { count: 'exact' });
        if (error) throw error;
        // Deduplicate just in case
        const unique = new Set((data || []).map(r => r.user_id));
        return Math.max(safeCount(count), unique.size);
      };
      try {
        const c = await retry();
        return c;
      } catch (inner) {
        // eslint-disable-next-line no-console
        console.warn('Presence precise count fallback failed:', inner?.message || inner);
      }
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Presence table query failed, using analytics fallback:', e?.message || e);
  }

  // Fallback: active users in last N minutes based on analytics_events (distinct user_id)
  try {
    const since = isoMinutesAgo(METRICS_CONFIG.activeWindowMinutes);
    const { data, error } = await client
      .from(METRICS_CONFIG.analyticsEventsTable)
      .select('user_id')
      .gte('created_at', since);

    if (error) {
      // eslint-disable-next-line no-console
      console.error('Active learners fallback error:', error.message);
      return 0;
    }
    const unique = new Set((data || []).map(r => r.user_id).filter(Boolean));
    return unique.size;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Active learners fallback exception:', e?.message || e);
    return 0;
  }
}

/**
 * PUBLIC_INTERFACE
 * Fetch count of recent completions within configured time window.
 * @returns {Promise<number>}
 */
export async function fetchRecentCompletionsCount() {
  const client = getSupabase?.();
  if (!client) return 0;
  try {
    const since = isoMinutesAgo(METRICS_CONFIG.completionWindowMinutes);
    const { count, error } = await client
      .from(METRICS_CONFIG.analyticsEventsTable)
      .select('*', { count: 'exact', head: true })
      .eq('event_name', METRICS_CONFIG.completionEventName)
      .gte('created_at', since);

    if (error) {
      // eslint-disable-next-line no-console
      console.error('fetchRecentCompletionsCount error:', error.message);
      return 0;
    }
    return safeCount(count);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('fetchRecentCompletionsCount exception:', e?.message || e);
    return 0;
  }
}

/**
 * PUBLIC_INTERFACE
 * Fetch all baseline metrics at once.
 * @returns {Promise<{activeLearners:number,totalCourses:number,recentCompletions:number}>}
 */
export async function fetchAllMetrics() {
  const [activeLearners, totalCourses, recentCompletions] = await Promise.all([
    fetchActiveLearnersCount(),
    fetchCoursesCount(),
    fetchRecentCompletionsCount(),
  ]);
  return { activeLearners, totalCourses, recentCompletions };
}
