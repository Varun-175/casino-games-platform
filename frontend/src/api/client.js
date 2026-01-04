// frontend/src/api/client.js

import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
  timeout: 10000,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach JWT token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle global responses
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Auto logout on 401
    if (error?.response?.status === 401) {
      localStorage.removeItem("access_token");
      window.dispatchEvent(new CustomEvent("logout"));
    }
    return Promise.reject(
      error?.response?.data || { message: error.message }
    );
  }
);

// Generic client
export const api = apiClient;

// ✅ Auth APIs
export const auth = {
  login: (payload) => apiClient.post("/auth/login", payload),
  register: (payload) => apiClient.post("/auth/register", payload),
  me: () => apiClient.get("/auth/me"),
};

// ✅ Games API
export const games = (params = {}, signal) =>
  apiClient.get("/games", { params, signal });

// ✅ Favorites API - UPGRADED WITH ADD/REMOVE METHODS
export const favorites = {
  list: (signal) => apiClient.get("/favorites", { signal }),
  add: (gameId) => apiClient.post(`/favorites/${gameId}`),
  remove: (gameId) => apiClient.delete(`/favorites/${gameId}`),
  toggle: (gameId) => apiClient.post(`/favorites/${gameId}/toggle`),
};

export default apiClient;
