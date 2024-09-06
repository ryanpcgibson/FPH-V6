// src/components/ProtectedRoute.tsx

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/Auth";
import NavMenu from "./NavMenu";

const ProtectedRoute = () => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <NavMenu />
            <Outlet />
        </div>
    );
};

export default ProtectedRoute;