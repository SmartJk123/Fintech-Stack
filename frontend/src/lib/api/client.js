// Configurable API client for EliteWallet.
// When VITE_API_BASE_URL is set, all calls route to your Spring Boot REST API.
// When unset, the service layer falls back to local mock data so the UI keeps working.

const API_BASE_URL = (import.meta.env && import.meta.env.VITE_API_BASE_URL) || '';
const TOKEN_KEY = 'ew_api_token';

export const isApiConfigured = () => Boolean(API_BASE_URL);
export const getApiBaseUrl = () => API_BASE_URL;

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
};

/**
 * @param {string | null} token
 */
export const setToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
};

export const clearToken = () => setToken(null);

/**
 * @param {'GET' | 'POST' | 'PUT' | 'DELETE'} method
 * @param {string} path
 * @param {unknown} [body]
 */
async function apiRequest(method, path, body) {
  /** @type {Record<string, string>} */
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      (data && typeof data === 'object' && (data.message || data.error)) ||
      (typeof data === 'string' && data) ||
      `Request failed: ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  get: (path) => apiRequest('GET', path),
  post: (path, body) => apiRequest('POST', path, body),
  put: (path, body) => apiRequest('PUT', path, body),
  del: (path) => apiRequest('DELETE', path),
};
