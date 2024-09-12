import React, { createContext, useContext } from "react";
import { useFamilyData } from "../hooks/useFamilyData";
import { FamilyData } from "../db/db_types";

interface FamilyDataContextProps {
  familyData: FamilyData | undefined;
  isLoading: boolean;
  error: Error | null;
}

const FamilyDataContext = createContext<FamilyDataContextProps | undefined>(
  undefined
);

interface FamilyDataProviderProps {
  familyId: number;
  children: React.ReactNode;
}

export const FamilyDataProvider: React.FC<FamilyDataProviderProps> = ({
  familyId,
  children,
}) => {
  const { data, isLoading, error } = useFamilyData(familyId);

  return (
    <FamilyDataContext.Provider value={{ familyData: data, isLoading, error }}>
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
