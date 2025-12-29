// src/api.js
const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL is not defined");
}

async function request(path, method = "GET", body = null, isForm = false) {
  const token = localStorage.getItem("token");

  const headers = {};
  if (!isForm) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = isForm ? body : JSON.stringify(body);

  const res = await fetch(`${API_URL}${path}`, options);

  const text = await res.text();
  const json = text ? JSON.parse(text) : {};

  return { ok: res.ok, status: res.status, ...json };
}

export const api = {
  // Auth
  login: (email, password) =>
    request("/api/login", "POST", { email, password }),

  register: (name, email, phone, password) =>
    request("/api/register", "POST", { name, email, phone, password }),

  // Animals
  getAnimals: () =>
    request("/api/animals", "GET"),

  getAnimal: (id) =>
    request(`/api/animals/${id}`, "GET"),

  createAnimal: (payload) =>
    request("/api/animals", "POST", payload),

  // Upload
  uploadImages: (formData) =>
    request("/api/upload", "POST", formData, true),
};

export default api;
