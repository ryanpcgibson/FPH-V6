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
  familyId: number | undefined;
}> = ({ children, familyId }) => {
  const { data, isLoading, error } = useFamilyData(familyId);
  console.log("data", data);
  console.log("familyId", familyId);
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
