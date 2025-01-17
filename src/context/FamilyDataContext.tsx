import React, { createContext, useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Families, FamilyData } from "@/db/db_types";
import { useFamilyData } from "@/hooks/useFamilyData";

interface FamilyDataContextType {
  families: Families | undefined;
  familyData: FamilyData | undefined;
  selectedFamilyId: number | null;
  selectedFamilyName: string | null;
  isLoading: boolean;
  error: Error | null;
}

const FamilyDataContext = createContext<FamilyDataContextType | undefined>(
  undefined
);

const FamilyDataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { familyId: familyIdParam } = useParams<{ familyId?: string }>();
  const selectedFamilyId = familyIdParam ? parseInt(familyIdParam, 10) : null;

  if (!selectedFamilyId) {
    return (
      <FamilyDataContext.Provider
        value={{
          families: undefined,
          familyData: undefined,
          selectedFamilyId: null,
          selectedFamilyName: null,
          isLoading: false,
          error: null,
        }}
      >
        {children}
      </FamilyDataContext.Provider>
    );
  }

  const { families, familyData, isLoading, error } =
    useFamilyData(selectedFamilyId);

  const contextValue = useMemo(
    () => ({
      families,
      familyData,
      selectedFamilyId,
      selectedFamilyName:
        families?.find((family) => family.id === selectedFamilyId)?.name ??
        null,
      isLoading,
      error,
    }),
    [familyData, selectedFamilyId, isLoading, error]
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
