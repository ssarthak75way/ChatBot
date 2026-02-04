import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { AuthResponse } from "./auth.api";

interface AuthContextValue {
  token: string | null;
  refreshToken: string | null;
  login: (data: AuthResponse) => void;
  logout: () => void;
  expiresIn: number | null; // Seconds remaining
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function decodeToken(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem("refreshToken"));
  const [expiresIn, setExpiresIn] = useState<number | null>(null);

  useEffect(() => {
    if (!token) {
      setExpiresIn(null);
      return;
    }

    const timer = setInterval(() => {
      const decoded = decodeToken(token);
      if (decoded && decoded.exp) {
        const remaining = Math.max(0, decoded.exp - Math.floor(Date.now() / 1000));
        setExpiresIn(remaining);
        if (remaining === 0) {
          logout();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [token]);

  function login(data: AuthResponse): void {
    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    setToken(data.accessToken);
    setRefreshToken(data.refreshToken);
  }

  function logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setToken(null);
    setRefreshToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, refreshToken, login, logout, expiresIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
