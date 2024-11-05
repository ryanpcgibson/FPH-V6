import React, { createContext, useContext, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useFamilies, UseFamiliesReturn } from "@/hooks/useFamilies";

const FamiliesContext = createContext<UseFamiliesReturn | undefined>(undefined);

export const FamiliesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isLoading: isLoadingUser, error: errorUser } = useAuth();
  const familiesData = useFamilies();

  useEffect(() => {
    if (user) {
      familiesData.fetchFamilies();
    } else if (errorUser || !isLoadingUser) {
      // Reset loading state if there's an error or user loading is complete
      familiesData.isLoading = false;
    }
  }, [user, errorUser, isLoadingUser]);

  return (
    <FamiliesContext.Provider value={familiesData}>
      {children}
    </FamiliesContext.Provider>
  );
};

export const useUserFamiliesContext = (): UseFamiliesReturn => {
  const context = useContext(FamiliesContext);
  if (context === undefined) {
    throw new Error("useFamilies must be used within a FamiliesProvider");
  }
  return context;
};

export default FamiliesProvider;
