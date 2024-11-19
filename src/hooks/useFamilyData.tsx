// src/hooks/useFamilyData.ts
import { useQuery } from "@tanstack/react-query";
import { supabaseClient } from "@/db/supabaseClient";
import { convertStringToDate } from "@/utils/dateUtils";
import { PetDB, LocationDB, MomentDB, UserDB, Families } from "@/db/db_types";
import { Pet, Location, Moment, User, Family } from "@/db/db_types";

export type FamilyDataDB = {
  pets: PetDB[];
  locations: LocationDB[];
  users: UserDB[];
  moments: MomentDB[];
};

export type FamilyData = {
  pets: Pet[];
  locations: Location[];
  users: User[];
  moments: Moment[];
};

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
  const { data, error } = await supabaseClient.rpc("get_family_records", {
    param_family_id: familyId,
  });

  if (error) {
    throw new Error(error.message);
  }
  if (!data) {
    throw new Error("No data returned from the database");
  }

  return convertFamilyData(data as FamilyDataDB);
};

const convertFamilyData = (data: FamilyDataDB): FamilyData => {
  return {
    pets: data.pets.map((pet: PetDB) => ({
      ...pet,
      start_date: convertStringToDate(pet.start_date),
      end_date: convertStringToDate(pet.end_date || undefined),
    })),
    locations: data.locations.map((location: LocationDB) => ({
      ...location,
      start_date: convertStringToDate(location.start_date),
      end_date: convertStringToDate(location.end_date || undefined),
    })),
    users: data.users,
    moments: data.moments.map((moment: MomentDB) => ({
      ...moment,
      start_date: convertStringToDate(moment.start_date),
      end_date: convertStringToDate(moment.end_date || undefined),
    })),
  };
};

export const useFamilyData = (familyId: number | null) => {
  const familiesQuery = useQuery({
    queryKey: ["families"],
    queryFn: fetchFamilies,
  });

  const familyDataQuery = useQuery({
    queryKey: ["familyData", familyId],
    queryFn: () => {
      if (familyId === null) {
        throw new Error("Family ID is null");
      }
      return fetchFamilyData(familyId);
    },
    enabled: familyId !== null, // Only run this query when familyId is available
  });

  return {
    families: familiesQuery.data,
    familyData: familyDataQuery.data,
    isLoading: familiesQuery.isLoading || (familyId !== null && familyDataQuery.isLoading),
    isError: familiesQuery.isError || familyDataQuery.isError,
    error: familiesQuery.error || familyDataQuery.error,
  };
};
