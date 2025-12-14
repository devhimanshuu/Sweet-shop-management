import axios from "axios";
import type { AuthResponse, Sweet, SearchParams } from "../types/index";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (email: string, password: string, name: string) =>
    api.post<AuthResponse>("/auth/register", { email, password, name }),

  login: (email: string, password: string) =>
    api.post<AuthResponse>("/auth/login", { email, password }),
};

// Sweet APIs
export const sweetAPI = {
  getAll: () => api.get<Sweet[]>("/sweets"),

  getById: (id: number) => api.get<Sweet>(`/sweets/${id}`),

  search: (params: SearchParams) =>
    api.get<Sweet[]>("/sweets/search", { params }),

  create: (data: Partial<Sweet>) => api.post<Sweet>("/sweets", data),

  update: (id: number, data: Partial<Sweet>) =>
    api.put<Sweet>(`/sweets/${id}`, data),

  purchase: (id: number, quantity: number) =>
    api.post<Sweet>(`/sweets/${id}/purchase`, { quantity }),

  restock: (id: number, quantity: number) =>
    api.post<Sweet>(`/sweets/${id}/restock`, { quantity }),

  delete: (id: number) => api.delete(`/sweets/${id}`),
};

export default api;
