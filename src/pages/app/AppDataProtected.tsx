import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useUserFamiliesContext } from "@/context/UserFamiliesContext";

const ProtectedRoute = () => {
  const { user, error: errorUser } = useAuth();
  const { families, isLoading: isLoadingFamilies, error: errorFamilies } = useUserFamiliesContext();

  // Handle auth errors or no user
  if (errorUser || !user) {
    return <Navigate to="/" />;
  }

  // Handle families loading and errors
  if (isLoadingFamilies) {
    return <div>Loading families...</div>;
  }

  if (errorFamilies) {
    return <div>Error loading families: {errorFamilies.message}</div>;
  }

  return <Outlet context={{ user, families }} />;
};

export default ProtectedRoute;
