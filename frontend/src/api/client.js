// frontend/src/api/client.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",  // Backend port
  timeout: 10000,  // 10s (faster feedback)
  withCredentials: false,  // No cookies (JWT only)
  headers: {
    "Content-Type": "application/json",
  },
});

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

apiClient.interceptors.response.use(
  (response) => response.data,  // Auto-extract data
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("access_token");
      // Emit logout to AuthContext (later)
    }
    return Promise.reject(error.response?.data || { message: error.message });
  }
);

export const api = apiClient;

export const auth = (endpoint) => apiClient.post(`/auth/${endpoint}`);
export const games = (params) => apiClient.get("/games", { params });
export const favorites = {
  list: () => apiClient.get("/favorites"),
  toggle: (gameId) => apiClient.post(`/favorites/${gameId}`),
};
