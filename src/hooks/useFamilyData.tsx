// src/hooks/useFamilyData.ts
import { useQuery } from "@tanstack/react-query";
import { supabaseClient } from "@/db/supabaseClient";
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
    overlappingPetsForLocations: {},
    overlappingLocationsForPets: {},
    overlappingPetsForPets: {},
    overlappingLocationsForLocations: {},
  };

  function areEntitiesOverlapping(
    entity1: {
      start_date: Date | undefined;
      end_date?: Date | undefined;
      id: number;
    },
    entity2: {
      start_date: Date | undefined;
      end_date?: Date | undefined;
      id: number;
    }
  ): boolean {
    const { start_date: startDate1, end_date: endDate1, id: id1 } = entity1;
    const { start_date: startDate2, end_date: endDate2, id: id2 } = entity2;

    if (!startDate1 || !startDate2) {
      console.error(
        `Error: startDate1 or startDate2 is undefined for ${id1} and ${id2}`
      );
      return false;
    }
    if (
      (endDate1 && endDate1 < startDate2) ||
      (endDate2 && endDate2 < startDate1)
    ) {
      return false;
    }
    return true;
  }

  // Calculate all overlapping relationships in a single pass
  convertedData.pets.forEach((pet) => {
    // Find overlapping pets
    convertedData.overlappingPetsForPets[pet.id] = convertedData.pets.filter(
      (otherPet) =>
        pet.id !== otherPet.id && areEntitiesOverlapping(pet, otherPet)
    );

    // Find overlapping locations
    convertedData.overlappingLocationsForPets[pet.id] =
      convertedData.locations.filter((location) =>
        areEntitiesOverlapping(pet, location)
      );
  });

  convertedData.locations.forEach((location) => {
    // Find overlapping pets (if not already calculated)
    convertedData.overlappingPetsForLocations[location.id] =
      convertedData.pets.filter((pet) => areEntitiesOverlapping(location, pet));

    // Find overlapping locations
    convertedData.overlappingLocationsForLocations[location.id] =
      convertedData.locations.filter(
        (otherLocation) =>
          location.id !== otherLocation.id &&
          areEntitiesOverlapping(location, otherLocation)
      );
  });

  return convertedData;
};

export const useFamilyData = (
  familyId?: number
): {
  families: Families | undefined;
  familyData: FamilyData | undefined;
  isLoading: boolean;
  isError: boolean;
  error: any;
} => {
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
