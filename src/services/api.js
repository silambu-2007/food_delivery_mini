// All backend requests live in this one file.
const API_URL = "http://localhost:5000/api";

// Generic helper: sends the request, returns { ok, data }.
// Network problems become a friendly message instead of a crash.
async function request(path, options = {}) {
  const userId = localStorage.getItem("userId");
  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(userId ? { "x-user-id": userId } : {}),
      },
    });
    const data = await response.json().catch(() => ({}));
    return { ok: response.ok, data };
  } catch (err) {
    return { ok: false, data: { message: "Cannot reach the server. Please check your connection and try again." } };
  }
}

// ---------- Users ----------
export const registerUser = (userData) =>
  request("/users/register", { method: "POST", body: JSON.stringify(userData) });

export const loginUser = (credentials) =>
  request("/users/login", { method: "POST", body: JSON.stringify(credentials) });

export const getUser = (id) => request(`/users/${id}`);

// ---------- Foods ----------
export const getFoods = () => request("/foods");

// ---------- Orders ----------
export const createOrder = (order) =>
  request("/orders", { method: "POST", body: JSON.stringify(order) });

export const getOrders = (userId) => request(`/orders/user/${userId}`);

export const getOrder = (id) => request(`/orders/${id}`);

export const updateOrder = (id, order) =>
  request(`/orders/${id}`, { method: "PUT", body: JSON.stringify(order) });

export const deleteOrder = (id) => request(`/orders/${id}`, { method: "DELETE" });
