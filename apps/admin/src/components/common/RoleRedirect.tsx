// RoleRedirect.tsx
import { useAuthStore } from "@/stores/authStore";
import { Navigate } from "react-router-dom";

export const RoleRedirect = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.role);
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return role === "admin"
    ? <Navigate to="/admin" replace />
    : <Navigate to="/dashboard" replace />;
};