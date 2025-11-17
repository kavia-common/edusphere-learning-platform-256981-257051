# Live Metrics Service

This service powers the "Live Metrics" counters on the Home page using Supabase.

## Files
- services/metrics.js — Fetches counts and subscribes to realtime updates
- hooks/useLiveMetrics.js — React hook to consume the metrics service
- pages/Home.jsx — Displays counters with animation and reduced-motion support

## Environment
Set these env vars (never hardcode secrets):
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY

See `.env.example`.

## Config
Adjust table/view names in `METRICS_CONFIG` within `services/metrics.js`:
- `coursesTable`: defaults to `courses`
- `analyticsEventsTable`: defaults to `analytics_events` (expects columns: `event_name`, `created_at`, `user_id`)
- `presenceTable`: defaults to `user_presence` (expects column: `user_id`)
- `completionEventName`: defaults to `completion`

## Realtime
- Presence channel listens to changes in `user_presence` and recomputes active users.
- Completions channel listens for `INSERT` on `analytics_events`, filters for `event_name === 'completion'`, and updates recent completions.

If your schema differs, update `METRICS_CONFIG` accordingly.

## Fallbacks
- If presence table is unavailable, active users are derived from recent activity in `analytics_events` over the last `activeWindowMinutes` (default 15).
- Hook includes polling fallback (default every 45 seconds).

## Reduced Motion
If the user has `prefers-reduced-motion: reduce`, the UI updates counters instantly without animation.
