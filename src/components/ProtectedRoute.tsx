import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/Auth";

const ProtectedRoute = () => {
    const { user } = useAuth()

    if (!user) {
        return <Navigate to="/login" />;
    }
    return (
        <div>
            <Outlet />
        </div>
    );
};

export default ProtectedRoute