import { auth } from "../firebase";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function getToken() {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  return user.getIdToken(); // auto-refreshes if expired
}

async function handleResponse(res) {
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "API error");
  return data;
}

async function authFetch(path, options = {}) {
  const token = await getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  return handleResponse(res);
}

// Auth
export const getMe = () => authFetch("/auth/me");

// Expenses
export const fetchExpenses = () => authFetch("/expenses/");
export const fetchSummary = () => authFetch("/expenses/summary");
export const createExpense = (data) =>
  authFetch("/expenses/", { method: "POST", body: JSON.stringify(data) });
export const deleteExpense = (id) =>
  authFetch(`/expenses/${id}`, { method: "DELETE" });
