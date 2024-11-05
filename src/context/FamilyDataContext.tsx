import React, { createContext, useContext, useMemo } from "react";
import { useParams, Outlet } from "react-router-dom";
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
  const { familyId } = useParams<{ familyId?: string }>();
  const { data, isLoading, error } = useFamilyData(
    parseInt(familyId || "", 10)
  );
  console.log("data", data);
  const contextValue = useMemo(
    () => ({
      familyData: data,
      familyId,
      isLoading,
      error,
    }),
    [data, familyId, isLoading, error]
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
