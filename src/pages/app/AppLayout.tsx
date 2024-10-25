import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuthData";
import { useUserFamiliesContext } from "@/context/UserFamiliesContext";

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
    <div className="h-screen w-screen flex justify-center">
      <div
        className="w-full max-w-[800px] max-h-[500px] h-full p-0 md:p-4 lg:p-8 flex flex-col justify-center overflow-hidden"
        id="app-layout"
      >
        <Outlet context={{ user, families }} />
      </div>
    </div>
  );
};

export default ProtectedRoute;
