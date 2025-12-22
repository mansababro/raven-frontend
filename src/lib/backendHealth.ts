const API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:4000";

type CheckOptions = {
  timeoutMs?: number;
  path?: string; // e.g. "/health"
};

/**
 * Returns true if the backend is reachable.
 *
 * Rules:
 * - Network / timeout errors => unreachable
 * - HTTP 5xx => unhealthy
 * - HTTP 2xx/3xx/4xx => reachable (even 401/404 proves the server responded)
 */
export async function checkBackendHealth(options: CheckOptions = {}): Promise<boolean> {
  const timeoutMs = options.timeoutMs ?? 3500;
  // Your backend's "health check" is currently served at "/" (per Swagger screenshot),
  // but allow overriding via env for flexibility.
  const path = options.path ?? (import.meta.env.VITE_BACKEND_HEALTH_PATH || "/");

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: "GET",
      cache: "no-store",
      // Health check is used only for "reachability" gating.
      // Use no-cors so this doesn't fail due to missing CORS headers in production.
      // If it succeeds, we treat backend as reachable.
      mode: "no-cors",
      signal: controller.signal,
    });

    // In no-cors mode, the response is opaque (status 0). If the request didn't throw,
    // treat it as reachable.
    if (res.type === "opaque") return true;

    // If server answered at all, it's "reachable"; only treat 5xx as down.
    if (res.status >= 500) return false;
    return true;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timer);
  }
}


