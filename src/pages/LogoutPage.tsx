import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const LogoutPage: React.FC = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      await signOut();
      navigate("/", { replace: true });
    };

    performLogout();
  }, [signOut, navigate]);

  return <div>Logging out...</div>;
};

export default LogoutPage;
