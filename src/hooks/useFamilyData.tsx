// src/hooks/useFamilyData.ts
import { useQuery } from "@tanstack/react-query";
import { supabaseClient } from "@/db/supabaseClient";
// import { convertStringToDate } from "@/utils/dateUtils";
import { convertEntityFromDB } from "@/utils/dbUtils";

import {
  Pet,
  Location,
  Moment,
  Families,
  FamilyDataDB,
  FamilyData,
} from "@/db/db_types";

const fetchFamilies = async (): Promise<Families> => {
  const { data, error } = await supabaseClient.rpc("get_families");

  if (error) {
    throw new Error(error.message);
  }
  if (!data) {
    throw new Error("No data returned from the database");
  }
  return data;
};

const fetchFamilyData = async (familyId: number): Promise<FamilyData> => {
  const { data, error } = (await supabaseClient.rpc("get_family_records", {
    param_family_id: familyId,
  })) as { data: FamilyDataDB | null; error: any };

  if (error) {
    throw new Error(error.message);
  }
  if (!data) {
    throw new Error("No data returned from the database");
  }

  const convertedData: FamilyData = {
    pets: data.pets.map((pet) => convertEntityFromDB(pet) as Pet),
    locations: data.locations.map(
      (location) => convertEntityFromDB(location) as Location
    ),
    users: data.users,
    moments: data.moments.map(
      (moment) => convertEntityFromDB(moment) as Moment
    ),
  };

  return convertedData;
};

export const useFamilyData = (familyId?: number) => {
  const familiesQuery = useQuery({
    queryKey: ["families"],
    queryFn: fetchFamilies,
  });

  const familyDataQuery = useQuery({
    queryKey: ["familyData", familyId],
    queryFn: () => {
      if (familyId) {
        return fetchFamilyData(familyId);
      } else {
        return undefined;
      }
    },
    enabled: familyId !== undefined, // Only run this query when familyId is available
  });

  return {
    families: familiesQuery.data,
    familyData: familyDataQuery.data,
    isLoading:
      familiesQuery.isLoading ||
      (familyId !== null && familyDataQuery.isLoading),
    isError: familiesQuery.isError || familyDataQuery.isError,
    error: familiesQuery.error || familyDataQuery.error,
  };
};
