import React, { createContext, useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import { FamilyData, useFamilyData } from "@/hooks/useFamilyData";

interface FamilyDataContextType {
  familyData: FamilyData | undefined;
  familyId: number | null;
  isLoading: boolean;
  error: Error | null;
}

const FamilyDataContext = createContext<FamilyDataContextType | undefined>(
  undefined
);

export const FamilyDataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { familyId: familyIdParam } = useParams<{ familyId?: string }>();
  const familyId = familyIdParam ? parseInt(familyIdParam, 10) : null;

  if (!familyId) {
    return (
      <FamilyDataContext.Provider
        value={{
          familyData: undefined,
          familyId: null,
          isLoading: false,
          error: null,
        }}
      >
        {children}
      </FamilyDataContext.Provider>
    );
  }

  const { familyData, isLoading, error } = useFamilyData(familyId);

  const contextValue = useMemo(
    () => ({
      familyData,
      familyId,
      isLoading,
      error,
    }),
    [familyData, familyId, isLoading, error]
  );

  return (
    <FamilyDataContext.Provider value={contextValue}>
      {children}
    </FamilyDataContext.Provider>
  );
};

export const useFamilyDataContext = () => {
  const context = useContext(FamilyDataContext);
  if (!context) {
    throw new Error(
      "useFamilyDataContext must be used within a FamilyDataProvider"
    );
  }
  return context;
};

export default FamilyDataProvider;
