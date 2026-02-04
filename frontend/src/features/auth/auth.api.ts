import axios from "axios";
import { API_BASE_URL } from "../../lib/config";
import type { AuthFormValues } from "./auth.schema";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

const api = axios.create({
  baseURL: API_BASE_URL
});

// Interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          const { accessToken, refreshToken: newRefreshToken } = response.data;

          localStorage.setItem("token", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function loginUser(data: AuthFormValues): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/login", data);
  return response.data;
}

export async function registerUser(data: AuthFormValues): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/register", data);
  return response.data;
}

export default api;
