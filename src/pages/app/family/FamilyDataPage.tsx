// pages/FamilyDataPage.tsx - debugging page to see raw family data

import React, { useMemo } from "react";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { JsonToTable } from "react-json-to-table";
import { Pet, Location, Moment } from "@/db/db_types";
import type { FamilyData } from "@/hooks/useFamilyData";
import { convertDateToISODateString } from "@/utils/dateUtils";

const DataPage: React.FC = () => {
  const { familyData, familyId, isLoading, error } = useFamilyDataContext();

  const convertFamilyData = (familyData: any): FamilyData => {
    if (!familyData) {
      return {
        family_name: "",
        pets: [],
        locations: [],
        users: [],
        moments: [],
      };
    } else {
      return {
        family_name: familyData.family_name,
        pets: familyData.pets.map((pet: Pet) => ({
          ...pet,
          start_date: convertDateToISODateString(pet.start_date),
          end_date: convertDateToISODateString(pet.end_date || undefined),
        })),
        locations: familyData.locations.map((location: Location) => ({
          ...location,
          start_date: convertDateToISODateString(location.start_date),
          end_date: convertDateToISODateString(location.end_date || undefined),
        })),
        users: familyData.users, // Assuming users don't have date fields
        moments: familyData.moments.map((moment: Moment) => ({
          ...moment,
          start_date: convertDateToISODateString(moment.start_date),
          end_date: convertDateToISODateString(moment.end_date || undefined),
        })),
      };
    }
  };

  const updatedData = useMemo(
    () => convertFamilyData(familyData),
    [familyData]
  );

  return <JsonToTable json={updatedData} />;
};

export default DataPage;
