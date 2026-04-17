const defaultApiBaseUrl = "http://127.0.0.1:5000";

export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") || defaultApiBaseUrl;

export type ApiErrorPayload = {
  error?: string;
  message?: string;
};

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
    throw new Error(data.error || data.message || `Request failed for ${path}`);
  }

  return data;
}

export function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}
