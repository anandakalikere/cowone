// src/api.js
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

async function request(path, method = "GET", body = null, isForm = false) {
  const token = localStorage.getItem("token");
  const headers = {};
  if (!isForm) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = isForm ? body : JSON.stringify(body);

  const res = await fetch(`${API_BASE}${path}`, options);
  // try parse json safely
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

// default export for older code using API.post style
export default {
  post: (path, body, opts = {}) => {
    // If opts.headers includes multipart header, let fetch handle boundary, so pass body as-is
    const isForm = body instanceof FormData;
    return request(path, "POST", body, isForm);
  },
  get: (path) => request(path, "GET"),
  api // also attach named object
};
