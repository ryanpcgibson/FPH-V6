import React, {
  createContext,
  useContext,
  useMemo,
} from "react";
import { Families, FamilyData } from "@/db/db_types";
import { useFamilyData } from "@/hooks/useFamilyData";
import { useParams } from "react-router-dom";
interface FamilyDataContextType {
  families: Families | undefined;
  familyData: FamilyData | undefined;
  selectedFamilyId: number | undefined;
  selectedFamilyName: string | undefined;
  isLoading: boolean;
  error: Error | null;
}

const FamilyDataContext = createContext<FamilyDataContextType | undefined>(
  undefined
);

export const FamilyDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { familyId: familyIdParam } = useParams<{ familyId?: string }>();
  const selectedFamilyId = familyIdParam
    ? parseInt(familyIdParam, 10)
    : undefined;

  const { families, familyData, isLoading, error } =
    useFamilyData(selectedFamilyId);

  const selectedFamilyName =
    selectedFamilyId && families
      ? families.find((f) => f.id === selectedFamilyId)?.name ?? undefined
      : undefined;

  const value = useMemo(
    () => ({
      families,
      familyData,
      selectedFamilyId,
      selectedFamilyName,
      isLoading,
      error,
    }),
    [families, familyData, selectedFamilyId, isLoading, error]
  );

  return (
    <FamilyDataContext.Provider value={value}>
      {children}
    </FamilyDataContext.Provider>
  );
};

export const useFamilyDataContext = () => {
  const context = useContext(FamilyDataContext);
  if (context === undefined) {
    throw new Error(
      "useFamilyDataContext must be used within a FamilyDataProvider"
    );
  }
  return context;
};

export default FamilyDataProvider;
