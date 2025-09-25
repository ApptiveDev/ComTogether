import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/signIn" replace />;
  }

  return <>{children}</>;
};
