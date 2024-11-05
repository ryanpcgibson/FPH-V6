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

export const FamilyDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {

  const params = useParams();
  console.log("All params:", params);

  const { familyId } = useParams<{ familyId?: string }>();
  console.log("familyId from params:", familyId);

  const parsedFamilyId = useMemo(
    () => (familyId ? parseInt(familyId, 10) : null),
    [familyId]
  );

  const { data, isLoading, error } = useFamilyData(parsedFamilyId);

  const contextValue = useMemo(
    () => ({
      familyData: data,
      familyId: parsedFamilyId,
      isLoading,
      error,
    }),
    [data, parsedFamilyId, isLoading, error]
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
