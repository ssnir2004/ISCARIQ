const BASE = `${import.meta.env.VITE_BASE_PATH ?? ""}/api`;

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = typeof body.error === "string" ? body.error : JSON.stringify(body.error ?? body);
    } catch {
      // ignore parse errors, keep statusText
    }
    throw new ApiError(res.status, message);
  }
  if (res.status === 204) return undefined as T;
  return withBlobUrls(await res.json()) as T;
}

// Pictures and files come as "/api/blobs/<hash>" (see the server's
// responseCache); point them at this app's API so <img src> and download
// links load them.
function withBlobUrls(value: unknown): unknown {
  if (typeof value === "string") return value.startsWith("/api/blobs/") ? `${location.origin}${BASE}${value.slice(4)}` : value;
  if (Array.isArray(value)) return value.map(withBlobUrls);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, withBlobUrls(v)]));
  return value;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body !== undefined ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: body !== undefined ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: body !== undefined ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
