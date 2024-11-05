import React, { createContext, useContext, useMemo } from "react";
import { useFamilies, UseFamiliesReturn } from "@/hooks/useFamilies";

const FamiliesContext = createContext<UseFamiliesReturn | undefined>(undefined);

export const FamiliesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { families, isLoading, error } = useFamilies();

  const contextValue = useMemo(
    () => ({
      families,
      isLoading,
      error,
    }),
    [families, isLoading, error]
  );

  if (error) {
    return <div>Error fetching families: {error.message}</div>;
  }

  if (isLoading) {
    return <div>Loading families...</div>;
  }

  return (
    <FamiliesContext.Provider value={contextValue}>
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
