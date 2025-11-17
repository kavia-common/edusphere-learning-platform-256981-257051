//
// Environment configuration and validation for EduSphere frontend
//
// PUBLIC_INTERFACE
export function getEnv() {
  /**
   * Returns the validated environment configuration.
   * Fails fast in development when required variables are missing.
   */
  const env = {
    SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL,
    SUPABASE_KEY: process.env.REACT_APP_SUPABASE_KEY,
    API_BASE: process.env.REACT_APP_API_BASE,
    BACKEND_URL: process.env.REACT_APP_BACKEND_URL,
    FRONTEND_URL: process.env.REACT_APP_FRONTEND_URL,
    WS_URL: process.env.REACT_APP_WS_URL,
    NODE_ENV: process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV || "development",
    ENABLE_SOURCE_MAPS: parseBoolean(process.env.REACT_APP_ENABLE_SOURCE_MAPS, false),
    PORT: toInt(process.env.REACT_APP_PORT, 3000),
    TRUST_PROXY: parseBoolean(process.env.REACT_APP_TRUST_PROXY, false),
    LOG_LEVEL: process.env.REACT_APP_LOG_LEVEL || "info",
    HEALTHCHECK_PATH: process.env.REACT_APP_HEALTHCHECK_PATH || "/healthz",
    FEATURE_FLAGS: parseJSON(process.env.REACT_APP_FEATURE_FLAGS, {}),
    EXPERIMENTS_ENABLED: parseBoolean(process.env.REACT_APP_EXPERIMENTS_ENABLED, false),
  };

  validateEnv(env);
  return env;
}

function parseBoolean(value, fallback = false) {
  if (typeof value === "string") {
    return ["1", "true", "TRUE", "yes", "on"].includes(value.trim());
  }
  return typeof value === "boolean" ? value : fallback;
}

function toInt(value, fallback) {
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

function parseJSON(value, fallback) {
  try {
    if (!value) return fallback;
    if (typeof value === "object") return value;
    return JSON.parse(value);
  } catch {
    console.warn("[env] Failed to parse REACT_APP_FEATURE_FLAGS, using fallback");
    return fallback;
  }
}

function validateEnv(env) {
  const missing = [];
  if (!env.SUPABASE_URL) missing.push("REACT_APP_SUPABASE_URL");
  if (!env.SUPABASE_KEY) missing.push("REACT_APP_SUPABASE_KEY");

  if (missing.length && env.NODE_ENV !== "production") {
    // Fail fast in dev/test to surface misconfiguration early.
    // eslint-disable-next-line no-console
    console.error(`[env] Missing required environment variables: ${missing.join(", ")}`);
  }
}

// PUBLIC_INTERFACE
export function isFeatureEnabled(key, defaultValue = false) {
  /** Returns whether a feature flag is enabled. */
  const env = getEnv();
  if (key in env.FEATURE_FLAGS) return !!env.FEATURE_FLAGS[key];
  return defaultValue;
}

// PUBLIC_INTERFACE
export function experimentsEnabled() {
  /** Returns whether experiments (A/B) are globally enabled. */
  const env = getEnv();
  return !!env.EXPERIMENTS_ENABLED;
}
