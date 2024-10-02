import React, { createContext, useContext, useState, useEffect } from "react";
import { useFamilyDataContext } from "./FamilyDataContext";
import { Pet, Moment } from "../db/db_types";

// TODO: store these types in the DB
// TODO: deeper analysis of pet statuses
export interface PetTimelineSegment {
  year: number;
  status:
    | "not-born"
    | "birth"
    | "alive"
    | "death"
    | "memory"
    | "deceased"
    | "transferred"
    | "adopted"
    | "lost";
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

  // Calculate the earliest start date across all pets
  const earliestStartDate = Math.min(
    ...pets.map((pet) => pet.start_date?.getFullYear() ?? currentYear)
  );

  return pets.map((pet) => {
    const petStartYear = pet.start_date?.getFullYear() ?? currentYear;
    const petEndYear = pet.end_date?.getFullYear() ?? currentYear;

    const segments: PetTimelineSegment[] = [];

    for (let year = petStartYear; year <= petEndYear; year++) {

      let status: PetTimelineSegment["status"] = "alive";

      // Set status for birth year
      if (year === petStartYear) {
        status = "birth";
      }

      // Set status for death year
      if (pet.end_date && year === petEndYear) {
        status = "death";
      }

      let yearMoments = moments
        .filter(
          (moment) =>
            moment.pets.some((p) => p.id === pet.id) &&
            moment.start_date?.getFullYear() === year
        )
        .map((moment) => ({ id: moment.id, title: moment.title }));

      if (yearMoments.length > 0) {
        status = "memory";
      }

      segments.push({ year, status, moments: yearMoments });
    }

    // Modify the "not-born" segments logic to use earliestStartDate
    if (petStartYear > earliestStartDate) {
      for (let year = earliestStartDate; year < petStartYear; year++) {
        segments.unshift({ year, status: "not-born" });
      }
    }

    // Add "deceased" segments after death year
    if (pet.end_date && petEndYear < currentYear) {
      for (let year = petEndYear + 1; year <= currentYear; year++) {
        segments.push({ year, status: "deceased" });
      }
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
  const {
    familyData,
    isLoading: isFamilyLoading,
    error: familyError,
  } = useFamilyDataContext();
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
        setError(err instanceof Error ? err : new Error("An error occurred"));
      } finally {
        setIsLoading(false);
      }
    }
  }, [familyData]);

  return (
    <PetTimelineContext.Provider
      value={{
        petTimelines,
        isLoading: isLoading || isFamilyLoading,
        error: error || familyError,
      }}
    >
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
