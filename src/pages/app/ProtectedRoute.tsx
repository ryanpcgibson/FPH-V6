import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = () => {
  const { user, error } = useAuth();

  if (error || !user) {
    return <Navigate to="/" />;
  }

  if (error) {
    return <div>Error authentication user</div>;
  }

  return <Outlet />;
};

export default ProtectedRoute;
