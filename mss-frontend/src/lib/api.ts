const defaultApiBaseUrl = "http://127.0.0.1:5000";

export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") || defaultApiBaseUrl;

export type ApiErrorPayload = {
  error?: string;
  message?: string;
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const data = (await response.json().catch(() => ({}))) as T & ApiErrorPayload;

  if (!response.ok) {
    throw new ApiError(
      data.error || data.message || `Request failed for ${path}`,
      response.status,
    );
  }

  return data;
}

export function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

/**
 * Attempt to obtain a new access token using the stored refresh token.
 * Returns the new access token string, or null if refresh is not possible.
 */
export async function tryRefreshToken(): Promise<string | null> {
  const refreshToken =
    typeof window !== "undefined"
      ? window.localStorage.getItem("mss_refresh_token")
      : null;
  if (!refreshToken) return null;

  try {
    const data = await apiFetch<{ access_token: string }>("/auth/refresh", {
      method: "POST",
      headers: authHeaders(refreshToken),
    });
    window.localStorage.setItem("mss_access_token", data.access_token);
    return data.access_token;
  } catch {
    return null;
  }
}

/**
 * Like apiFetch, but if the request returns a 401 it automatically tries to
 * refresh the access token once and retries the original request.
 * Pass `onAuthFailure` to handle the case where refresh also fails.
 */
export async function apiFetchAuth<T>(
  path: string,
  token: string,
  init?: RequestInit,
  onAuthFailure?: () => void,
): Promise<T> {
  try {
    return await apiFetch<T>(path, { ...init, headers: authHeaders(token) });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      const newToken = await tryRefreshToken();
      if (newToken) {
        return apiFetch<T>(path, { ...init, headers: authHeaders(newToken) });
      }
      onAuthFailure?.();
      throw error;
    }
    throw error;
  }
}
