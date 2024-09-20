import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuthData";
import { useUserFamiliesContext } from "@/context/UserFamiliesContext";
import NavMenu from "@/components/NavMenu";

const ProtectedRoute = () => {
  const { user, isLoading: isLoadingUser, error: errorUser } = useAuth();
  const {
    families,
    isLoading: isLoadingFamilies,
    error: errorFamilies,
  } = useUserFamiliesContext();

  if (isLoadingUser) {
    return <div>Loading...</div>;
  }

  if (errorUser) {
    if (errorUser.message === "User not authenticated") {
      return <Navigate to="/" />;
    }
    return <div>Error: {errorUser.message}</div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  if (isLoadingFamilies) {
    return <div>Loading families...</div>;
  }

  if (errorFamilies) {
    return <div>Error loading families: {errorFamilies.message}</div>;
  }

  return (
    <div>
      <NavMenu />
      <Outlet context={{ user, families }} />
    </div>
  );
};

export default ProtectedRoute;
