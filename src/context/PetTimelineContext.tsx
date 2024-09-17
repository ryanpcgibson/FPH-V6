import React, { createContext, useContext, useState, useEffect } from "react";
import { useFamilyDataContext } from "./FamilyDataContext";
import { Pet, Moment } from "../db/db_types";

export interface PetTimelineSegment {
  year: number;
  status: "not-born" | "alive" | "memory" | "deceased";
  moments?: { id: number; title: string }[];
}

export interface PetTimeline {
  petId: number;
  petName: string;
  segments: PetTimelineSegment[];
}

interface PetTimelineContextProps {
  petTimelines: PetTimeline[];
  isLoading: boolean;
  error: Error | null;
}

const PetTimelineContext = createContext<PetTimelineContextProps | undefined>(
  undefined
);

function generatePetTimelines(pets: Pet[], moments: Moment[]): PetTimeline[] {
  const currentYear = new Date().getFullYear();

  // Find the overall min and max years across all pets
  const allYears = pets.flatMap(pet => [
    pet.start_date?.getFullYear() ?? currentYear,
    pet.end_date?.getFullYear() ?? currentYear
  ]);
  const minYear = Math.min(...allYears);
  const maxYear = Math.max(...allYears);

  return pets.map((pet) => {
    const petStartYear = pet.start_date?.getFullYear() ?? currentYear;
    const petEndYear = pet.end_date?.getFullYear() ?? currentYear;

    const segments: PetTimelineSegment[] = [];

    for (let year = minYear; year <= maxYear; year++) {
      let status: PetTimelineSegment["status"] = "not-born";
      let yearMoments: { id: number; title: string }[] = [];

      if (year >= petStartYear && year <= petEndYear) {
        status = "alive";

        yearMoments = moments.filter(
          (moment) =>
            moment.pets.some((p) => p.id === pet.id) &&
            moment.start_date?.getFullYear() === year
        ).map(moment => ({ id: moment.id, title: moment.title }));

        if (yearMoments.length > 0) {
          status = "memory";
        }
      } else if (year > petEndYear) {
        status = "deceased";
      }

      segments.push({ year, status, moments: yearMoments });
    }

    return {
      petId: pet.id,
      petName: pet.name,
      segments,
    };
  });
}

export const PetTimelineProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { familyData, isLoading: isFamilyLoading, error: familyError } = useFamilyDataContext();
  const [petTimelines, setPetTimelines] = useState<PetTimeline[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (familyData) {
      try {
        setIsLoading(true);
        const timelines = generatePetTimelines(
          familyData.pets,
          familyData.moments
        );
        setPetTimelines(timelines);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setIsLoading(false);
      }
    }
  }, [familyData]);

  return (
    <PetTimelineContext.Provider value={{ petTimelines, isLoading: isLoading || isFamilyLoading, error: error || familyError }}>
      {children}
    </PetTimelineContext.Provider>
  );
};

export const usePetTimelineContext = () => {
  const context = useContext(PetTimelineContext);
  if (!context) {
    throw new Error(
      "usePetTimelineContext must be used within a PetTimelineProvider"
    );
  }
  return context;
};
