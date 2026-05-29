import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  /* Still rehydrating from localStorage — render nothing */
  if (loading) return null;

  /* Not logged in — send to login, remember where they were going */
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  /* Role mismatch — redirect to their correct dashboard */
  if (role && user.role?.toLowerCase() !== role.toLowerCase()) {
    const fallback = user.role?.toLowerCase() === "registrar" ? "/registrar/dashboard" : "/user/dashboard";
    return <Navigate to={fallback} replace />;
  }

  return children;
}
