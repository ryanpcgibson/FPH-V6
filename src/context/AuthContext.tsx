import React from "react";
import { AuthContext, useAuthData } from "../hooks/useAuthData";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const authData = useAuthData();

  return (
    <AuthContext.Provider value={authData}>
      {!authData.isLoading && children}
    </AuthContext.Provider>
  );
};
