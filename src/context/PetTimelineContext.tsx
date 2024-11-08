import React, { createContext, useContext, useMemo } from "react";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { Pet, Moment } from "@/db/db_types";
import type { PetTimeline, PetTimelineSegment } from "@/types/timeline";

interface PetTimelineContextProps {
  petTimelines: PetTimeline[];
  isLoading: boolean;
  error: Error | null;
  getFilteredPetTimelines: (petId?: number) => PetTimeline[];
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

      // Set status for death year
      if (pet.end_date && year === petEndYear && year === petStartYear) {
        status = "birth-and-death";
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

export const PetTimelineProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const {
    familyData,
    familyId,
    isLoading: isFamilyLoading,
  } = useFamilyDataContext();

  const contextValue = useMemo(() => {
    if (!familyId || !familyData) {
      return {
        petTimelines: [],
        isLoading: false,
        error: null,
        getFilteredPetTimelines: () => [],
      };
    }

    try {
      const timelines = generatePetTimelines(
        familyData.pets,
        familyData.moments
      );
      return {
        petTimelines: timelines,
        isLoading: isFamilyLoading,
        error: null,
        getFilteredPetTimelines: (petId?: number) => {
          return petId
            ? timelines.filter((timeline) => timeline.petId === petId)
            : timelines;
        },
      };
    } catch (err) {
      return {
        petTimelines: [],
        isLoading: false,
        error: err instanceof Error ? err : new Error("An error occurred"),
        getFilteredPetTimelines: () => [],
      };
    }
  }, [familyData, familyId, isFamilyLoading]);

  if (contextValue.error) {
    return (
      <div>Error generating pet timelines: {contextValue.error.message}</div>
    );
  }

  if (contextValue.isLoading) {
    return <div>Loading pet timelines...</div>;
  }

  const enhancedValue = {
    ...contextValue,
    getFilteredPetTimelines: (petId?: number) => {
      return petId
        ? contextValue.petTimelines.filter(
            (timeline) => timeline.petId === petId
          )
        : contextValue.petTimelines;
    },
  };

  return (
    <PetTimelineContext.Provider value={enhancedValue}>
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

export default PetTimelineProvider;
