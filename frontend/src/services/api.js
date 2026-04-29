import { auth } from "../firebase";

const BASE = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;

if (!BASE) {
  console.error("❌ CRITICAL ERROR: REACT_APP_API_URL is not defined!");
  console.error("Please check your .env file and ensure it contains REACT_APP_API_URL=http://localhost:8000");
}

// --- CUSTOM CHAT ERROR CLASSES ---
export class ChatError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "ChatError";
    this.code = code;
  }
}
export class ChatParseError extends ChatError {}
export class ChatServiceError extends ChatError {}
export class ChatRateLimitError extends ChatError {}
export class ChatNetworkError extends ChatError {}
export class ChatTimeoutError extends ChatError {}

async function getToken() {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  return user.getIdToken();
}

async function handleResponse(res) {
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "API error");
  return data;
}

async function authFetch(path, options = {}) {
  const token = await getToken();
  const controller = new AbortController();
  const timeoutId = options.signal ? null : setTimeout(() => controller.abort(), 10000); 

  try {
    const res = await fetch(`${BASE}${path}`, {
      ...options,
      signal: options.signal || controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
    if (timeoutId) clearTimeout(timeoutId);
    return handleResponse(res);
  } catch (error) {
    if (timeoutId) clearTimeout(timeoutId);
    if (error.name === 'AbortError' && !options.signal) {
      throw new Error("Request timeout - Server not responding");
    }
    throw error;
  }
}

/**
 * Optimized chat function with 30s timeout and detailed error handling
 */
export async function sendChatMessage(message) {
  const token = await getToken();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); 

  try {
    const res = await fetch(`${BASE}/chat/`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message }), 
    });

    clearTimeout(timeoutId);
    
    if (res.status === 204) return null;
    const data = await res.json();

    if (!res.ok) {
      if (res.status === 422) throw new ChatParseError(data.detail || "AI hông hiểu ý bạn, thử lại nhé?");
      if (res.status === 503) throw new ChatServiceError(data.detail || "Hệ thống AI đang bận xử lý.");
      if (res.status === 429) throw new ChatRateLimitError("Bạn nhắn nhanh quá, đợi xíu nha!");
      throw new ChatError(data.detail || "Lỗi kết nối tới AI.");
    }

    return data;

  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") throw new ChatTimeoutError("AI phản hồi quá lâu, có thể mạng yếu.");
    if (error instanceof ChatError) throw error;
    throw new ChatNetworkError("Không thể kết nối mạng. Vui lòng kiểm tra lại.");
  }
}

export const fetchExpenses = (month, year, options = {}) => {
  const query = month && year ? `?month=${month}&year=${year}` : "";
  return authFetch(`/expenses/${query}`, { ...options });
};

export const fetchSummary = (month, year, options = {}) => {
  const query = month && year ? `?month=${month}&year=${year}` : "";
  return authFetch(`/expenses/summary${query}`, { ...options });
};

export const createExpense = (data) => authFetch("/expenses/", { method: "POST", body: JSON.stringify(data) });
export const deleteExpense = (id) => authFetch(`/expenses/${id}`, { method: "DELETE" });
