const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export const tokenKey = "ayush_24cs037_jwt";

export function getToken() {
  return localStorage.getItem(tokenKey);
}

export function signOut() {
  localStorage.removeItem(tokenKey);
}

async function call(endpoint, options = {}) {
  const token = getToken();

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  const body = await response.json().catch(() => ({}));

  if (response.status === 401) {
    signOut();
    window.dispatchEvent(new Event("session-expired"));
  }

  if (!response.ok) {
    throw new Error(body.message || "Request failed");
  }

  return body;
}

export const register = (email, password) =>
  call("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });

export const login = (email, password) =>
  call("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });

export const me = () => call("/auth/me");
export const tasks = () => call("/tasks");

export const createTask = payload =>
  call("/tasks", {
    method: "POST",
    body: JSON.stringify(payload)
  });

export const toggleTask = (id, payload) =>
  call(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });

export const deleteTask = id =>
  call(`/tasks/${id}`, {
    method: "DELETE"
  });
