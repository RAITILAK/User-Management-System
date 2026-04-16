import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  // Not logged in — go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role — redirect to their allowed page
  if (!allowedRoles.includes(user.role)) {
    if (user.role === "manager") return <Navigate to="/users" replace />;
    if (user.role === "user") return <Navigate to="/profile" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
