# EduSphere Frontend (React)

EduSphere Frontend is a React single-page application that delivers a modern, accessible, and real-time learning experience. It uses Supabase for authentication, database, storage, and realtime features, and includes a glassmorphism-inspired UI, role-based routing, analytics capture, and payments stubs.

## Overview

The app is structured as a lightweight React SPA with minimal dependencies and clear separation of concerns:

- Environment handling in `src/config/env.js`
- Supabase client singleton in `src/lib/supabaseClient.js`
- Common UI components in `src/components/common`
- Pages segmented under `src/pages/*`
- Realtime hooks under `src/hooks/*`
- Services under `src/services/*`
- Global styles in `src/styles/*` plus `src/App.css`

The app expects certain tables and policies in Supabase (see "Supabase Setup") and reads configuration from environment variables (see ".env variables").

## Prerequisites

- Node.js 18+ and npm 8+ recommended
- A Supabase project with URL and anon key
- Optional: Supabase storage bucket "lesson-media" for lesson videos
- Optional: A Supabase Edge Function for payments (see "Edge Functions")

## Getting Started

1. Copy `.env.example` to `.env` and populate the values:
   - `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_KEY` are required in development.
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
   The app runs at http://localhost:3000 by default.

4. Run tests (CI mode, no watch):
   ```
   npm test
   ```

5. Build for production:
   ```
   npm run build
   ```

## Project Scripts

- `npm start` — Start dev server
- `npm test` — Run tests once in CI-friendly mode
- `npm run build` — Build production bundle. Honors `REACT_APP_ENABLE_SOURCE_MAPS` (default disabled)

## .env Variables

The app reads variables prefixed with `REACT_APP_` at build/runtime:

- Required for Supabase:
  - `REACT_APP_SUPABASE_URL` — Supabase project URL
  - `REACT_APP_SUPABASE_KEY` — Supabase anon public key
- Optional App URLs and APIs:
  - `REACT_APP_API_BASE` — Base URL for any custom API (not required for basic usage)
  - `REACT_APP_BACKEND_URL` — Backend base URL (if used)
  - `REACT_APP_FRONTEND_URL` — Public URL of this frontend (useful for redirects)
  - `REACT_APP_WS_URL` — WebSocket endpoint (not required for Supabase realtime)
- Build/runtime flags:
  - `REACT_APP_NODE_ENV` — Overrides environment; otherwise falls back to `NODE_ENV`
  - `REACT_APP_ENABLE_SOURCE_MAPS` — "true"/"false" to enable source maps in build
  - `REACT_APP_PORT` — Port for dev server (default 3000)
  - `REACT_APP_TRUST_PROXY` — "true"/"false" if behind reverse proxy (informational in frontend)
  - `REACT_APP_LOG_LEVEL` — Log level hint ("debug"|"info"|"warn"|"error")
  - `REACT_APP_HEALTHCHECK_PATH` — Health path hint (default /healthz)
- Feature flags:
  - `REACT_APP_FEATURE_FLAGS` — JSON object string of feature flags (e.g., {"newNavbar":true})
  - `REACT_APP_EXPERIMENTS_ENABLED` — "true"/"false" to toggle experiments globally

Parsing, validation and helpers live in `src/config/env.js`.

## Key Implementation Notes

- Environment handling: `getEnv()`, `isFeatureEnabled()`, and `experimentsEnabled()` are exported from `src/config/env.js`. In non-production, missing required Supabase vars are surfaced in console for easier troubleshooting.
- Supabase client: `src/lib/supabaseClient.js` exports `getSupabase()` singleton and helpers `getStorage()` and `getRealtime()`. On sign-in or token refresh, it upserts a minimal user profile row in the `profiles` table.
- Realtime & presence: `src/hooks/usePresence.js` provides presence tracking via Supabase channels.
- Analytics: `src/hooks/useAnalytics.js` (if present) batches events into `analytics_events` table (configure RLS accordingly).
- Auth flow: Pages under `src/pages/auth/*` use Supabase methods for login, signup, and password reset.
- Protected routing: `src/components/common/routing/ProtectedRoute.jsx` enforces auth and role checks via a `useAuth` provider.

Note: Some code may assume an `AuthProvider` component and a `routes` module exist in `src/providers/AuthProvider.jsx` and `src/routes/index.jsx` respectively. If those are not present in your tree, ensure they are added or adjust imports accordingly.

## Supabase Setup

The app expects the following minimal schema and Row Level Security (RLS) setup. Adjust as needed:

### Tables

- profiles
  - id: uuid (PK, references auth.users.id)
  - email: text
  - full_name: text
  - avatar_url: text
  - role: text (e.g., "student" | "instructor" | "admin")
  - updated_at: timestamptz
- courses
  - id: uuid (PK)
  - title: text
  - subtitle: text
  - created_by: uuid (FK -> profiles.id)
  - created_at: timestamptz default now()
- lessons
  - id: uuid (PK)
  - course_id: uuid (FK -> courses.id)
  - position: int
  - title: text
  - video_path: text (path in Supabase Storage bucket "lesson-media")
  - created_at: timestamptz default now()
- payments
  - id: uuid (PK)
  - user_id: uuid (FK -> profiles.id)
  - amount: int (cents)
  - status: text
  - created_at: timestamptz default now()
- analytics_events
  - id: bigint generated always as identity (PK)
  - event: text
  - props: jsonb
  - ts: timestamptz

### Enable RLS

```
alter table profiles enable row level security;
alter table courses enable row level security;
alter table lessons enable row level security;
alter table payments enable row level security;
alter table analytics_events enable row level security;
```

### Example RLS Policies

Adjust to your needs and security posture:

- profiles
  - Select own profile:
    ```
    create policy "select own profile" on profiles
    for select using (auth.uid() = id);
    ```
  - Upsert own profile:
    ```
    create policy "upsert own profile" on profiles
    for insert with check (auth.uid() = id);
    create policy "update own profile" on profiles
    for update using (auth.uid() = id);
    ```
- courses
  - Public read:
    ```
    create policy "read all courses" on courses
    for select using (true);
    ```
  - Instructors/Admin manage:
    ```
    create policy "instructors manage own courses" on courses
    for insert with check (exists(select 1 from profiles p where p.id = auth.uid() and p.role in ('instructor','admin')));
    create policy "update own courses" on courses
    for update using (created_by = auth.uid());
    ```
- lessons
  - Read lessons of readable courses:
    ```
    create policy "read lessons" on lessons for select using (true);
    ```
  - Manage by course owners (simplified):
    ```
    create policy "manage lessons by course owner" on lessons
    for all using (exists(select 1 from courses c where c.id = lessons.course_id and c.created_by = auth.uid()))
    with check (exists(select 1 from courses c where c.id = lessons.course_id and c.created_by = auth.uid()));
    ```
- payments
  - Read own payments:
    ```
    create policy "read own payments" on payments
    for select using (user_id = auth.uid());
    ```
  - Insert by Edge Function only: use service role key in function (no direct client insert).
- analytics_events
  - Allow authenticated insert:
    ```
    create policy "insert analytics" on analytics_events
    for insert with check (auth.role() = 'authenticated');
    ```
  - Optional: Restrict select to admins:
    ```
    create policy "admin read analytics" on analytics_events
    for select using (exists(select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));
    ```

### Storage

Create a storage bucket for lesson media:

- Bucket name: `lesson-media`
- Public: false (use signed URLs as implemented in LessonPlayer)
- Configure policies to allow read via signed URL only

### Edge Functions (Optional)

The checkout page (`src/pages/payments/Checkout.jsx`) invokes a function `create_payment_intent`. Provide a Supabase Edge Function with that name to integrate your payment provider (e.g., Stripe) and use the service role for secure operations.

Example outline (TypeScript Deno function):

```ts
// supabase/functions/create_payment_intent/index.ts
import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
  // Validate auth if needed via Authorization header
  // Call Stripe to create an intent and return result
  return new Response(JSON.stringify({ id: "pi_123" }), {
    headers: { "Content-Type": "application/json" },
  });
});
```

Deploy the function with `supabase functions deploy create_payment_intent`.

## Accessibility

- "Skip to content" link is included via `src/components/common/skip/SkipToContent.jsx`.
- Dialogs (`Modal.jsx`) implement basic focus trapping and ESC to close.
- Buttons and icons provide `aria-label` and keyboard focus styles.
- Tables use ARIA roles through `DataTable.jsx`.
- Global focus ring variables are provided in `src/styles/theme.css`.
- Use semantic headings and ensure color contrast when customizing styles.

Run automated checks:
- Basic jest-dom tests are provided (e.g., `src/__tests__/a11y.test.js`). You can extend with axe-core for deeper checks.

## Feature Flags and Experiments

- Feature flags are passed as a JSON string via `REACT_APP_FEATURE_FLAGS`, parsed in `getEnv()`. Example:
  ```
  REACT_APP_FEATURE_FLAGS={"newNavbar":true,"betaLessonSync":false}
  ```
- Global experiments toggle:
  ```
  REACT_APP_EXPERIMENTS_ENABLED=true
  ```
- Suggested hook (if present) `src/hooks/useFeatureFlag.js` can read from env; otherwise import `isFeatureEnabled` directly from `src/config/env.js`.

## Deployment Notes

- This is a client-side app; environment variables must be set at build time. For platforms like Netlify/Vercel, define the `REACT_APP_*` variables in the project settings.
- Do not expose secrets other than Supabase anon public key on the client. Use Edge Functions or your backend for privileged actions (payments, admin operations).
- For best caching and performance, serve the production build over HTTPS with proper cache headers.
- Source maps are disabled by default; set `REACT_APP_ENABLE_SOURCE_MAPS=true` for troubleshooting only and avoid in production.

## Health and Observability

- A health path variable `REACT_APP_HEALTHCHECK_PATH` is provided for consistency across environments. Consider exposing a static `/healthz` route through your hosting to integrate with uptime monitors.
- Logs should avoid sensitive data. The frontend uses console logs sparingly for environment parsing warnings.

## Folder Structure (Selected)

```
src/
  components/common/...
  config/env.js
  lib/supabaseClient.js
  hooks/usePresence.js
  pages/
    auth/
    courses/
    analytics/
    payments/
  services/
    courses.js
  styles/
    glass.css
    theme.css
  App.css
  App.js
  index.js
```

## Security Considerations

- No secrets are hardcoded; provide values through environment variables.
- RLS must be enabled and correctly configured on all user data tables.
- Use signed URLs for private storage assets (e.g., lesson videos).
- Payment-related actions must be performed server-side via Edge Functions or a secure backend.

## Troubleshooting

- Missing Supabase variables in development will log an error in console from `validateEnv()`.
- If media does not load in LessonPlayer, ensure the `lesson-media` bucket exists and the `video_path` matches an object path; verify signed URL creation.
- If checkout fails, verify the `create_payment_intent` Edge Function is deployed and accessible, and that auth headers are handled as needed.

## License

Internal project. See repository license terms where applicable.
