import React, { createContext, useContext } from "react";
import { Pet } from "@/db/db_types";
import { useFamilyDataContext } from "@/context/FamilyDataContext";

interface PetDataContextProps {
  petData: Pet | undefined;
  petId: number | null;
  isLoading: boolean;
  error: Error | null;
}

const PetDataContext = createContext<PetDataContextProps | undefined>(
  undefined
);

interface PetDataProviderProps {
  petId: number;
  children: React.ReactNode;
}

export const PetDataProvider: React.FC<PetDataProviderProps> = ({
  petId,
  children,
}) => {
  const { familyData, isLoading, error } = useFamilyDataContext();

  const petData = familyData?.pets.find((pet) => pet.id === petId);

  return (
    <PetDataContext.Provider
      value={{
        petData,
        petId,
        isLoading,
        error,
      }}
    >
      {children}
    </PetDataContext.Provider>
  );
};

export const usePetDataContext = () => {
  const context = useContext(PetDataContext);
  if (!context) {
    throw new Error("usePetDataContext must be used within a PetDataProvider");
  }
  return context;
};
