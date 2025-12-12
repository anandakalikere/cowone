// src/api.js
const API_URL = (import.meta.env && import.meta.env.VITE_API_URL) ? import.meta.env.VITE_API_URL : "https://cowone.onrender.com";

async function request(path, method = "GET", body = null, isForm = false) {
  const token = localStorage.getItem("token");
  const headers = {};
  if (!isForm) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = isForm ? body : JSON.stringify(body);

  const res = await fetch(`${API_URL}${path}`, options);
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, ...json };
}

export const api = {
  login: (email, password) => request("/api/login", "POST", { email, password }),
  register: (name, email, phone, password) => request("/api/register", "POST", { name, email, phone, password }),
  me: () => request("/api/me", "GET"),
  createListing: (payload) => request("/api/listings", "POST", payload),
  getListings: () => request("/api/listings", "GET"),
  uploadImages: (formData) => request("/api/upload", "POST", formData, true)
};

export default {
  post: (path, body, opts = {}) => {
    const isForm = body instanceof FormData;
    return request(path, "POST", body, isForm);
  },
  get: (path) => request(path, "GET"),
  api
};
