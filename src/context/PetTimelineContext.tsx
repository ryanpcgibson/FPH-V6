import React, { createContext, useContext, useState, useEffect } from "react";
import { useFamilyDataContext } from "./FamilyDataContext";
import { Pet, Moment } from "../db/db_types";

export interface PetTimelineSegment {
  year: number;
  status: "not-born" | "alive" | "memory" | "deceased";
}

export interface PetTimeline {
  petId: number;
  petName: string;
  segments: PetTimelineSegment[];
}

interface PetTimelineContextProps {
  petTimelines: PetTimeline[];
}

const PetTimelineContext = createContext<PetTimelineContextProps | undefined>(
  undefined
);

function generatePetTimelines(pets: Pet[], moments: Moment[]): PetTimeline[] {
  const currentYear = new Date().getFullYear();

  return pets.map((pet) => {
    const startYear = pet.start_date?.getFullYear() ?? currentYear;
    const endYear = pet.end_date ? pet.end_date.getFullYear() : currentYear;

    const segments: PetTimelineSegment[] = [];

    for (let year = startYear - 1; year <= endYear + 1; year++) {
      let status: PetTimelineSegment["status"] = "not-born";

      if (year >= startYear && year <= endYear) {
        status = "alive";

        const hasMemory = moments.some(
          (moment) =>
            moment.pets.some((p) => p.id === pet.id) &&
            moment.start_date?.getFullYear() === year
        );

        if (hasMemory) {
          status = "memory";
        }
      } else if (year > endYear) {
        status = "deceased";
      }

      segments.push({ year, status });
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
  const { familyData } = useFamilyDataContext();
  const [petTimelines, setPetTimelines] = useState<PetTimeline[]>([]);

  useEffect(() => {
    if (familyData) {
      const timelines = generatePetTimelines(
        familyData.pets,
        familyData.moments
      );
      setPetTimelines(timelines);
    }
  }, [familyData]);

  return (
    <PetTimelineContext.Provider value={{ petTimelines }}>
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
