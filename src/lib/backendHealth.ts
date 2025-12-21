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
  const path = options.path ?? (import.meta.env.VITE_BACKEND_HEALTH_PATH || "/health");

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    });

    // If server answered at all, it's "reachable"; only treat 5xx as down.
    if (res.status >= 500) return false;
    return true;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timer);
  }
}


