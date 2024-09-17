import React, { createContext, useContext } from "react";
import { FamilyData, useFamilyData } from "../hooks/useFamilyData";

interface FamilyDataContextProps {
  familyData: FamilyData | undefined;
  familyId: number;
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
    <FamilyDataContext.Provider value={{ familyData: data, familyId, isLoading, error }}>
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
