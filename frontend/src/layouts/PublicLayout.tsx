import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/auth.context";

export function PublicLayout() {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/chat" replace />;
  }

  return <Outlet />;
}
