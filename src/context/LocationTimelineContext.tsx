import React, { createContext, useContext, useMemo, useCallback } from "react";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { Location, Moment } from "@/db/db_types";
import type {
  LocationTimeline,
  LocationTimelineSegment,
} from "@/types/timeline";

interface LocationTimelineContextProps {
  locationTimelines: LocationTimeline[];
  isLoading: boolean;
  error: Error | null;
  getFilteredLocationTimelines: (petId?: number) => LocationTimeline[];
}

const LocationTimelineContext = createContext<
  LocationTimelineContextProps | undefined
>(undefined);

function generateLocationTimelines(
  locations: Location[],
  moments: Moment[]
): LocationTimeline[] {
  const currentYear = new Date().getFullYear();
  const earliestStartDate = Math.min(
    ...locations.map((location) => {
      return location.start_date?.getFullYear() ?? currentYear;
    })
  );

  return locations.map((location) => {
    try {
      const locationStartYear =
        location.start_date?.getFullYear() ?? currentYear;
      const locationEndYear = location.end_date?.getFullYear() ?? currentYear;

      const segments: LocationTimelineSegment[] = [];


      for (let year = locationStartYear; year <= locationEndYear; year++) {
        let status: LocationTimelineSegment["status"] = "residing";

        if (year === locationStartYear) {
          status = "move-in";
        }

        if (location.end_date && year === locationEndYear) {
          status = "move-out";
        }

        let yearMoments = moments
          .filter(
            (moment) =>
              moment.locations?.some((l) => l.id === location.id) &&
              moment.start_date?.getFullYear() === year
          )
          .map((moment) => ({ id: moment.id, title: moment.title }));

        if (yearMoments.length > 0) {
          status = "memory";
        }
        segments.push({ year, status, moments: yearMoments });
      }

      if (locationStartYear > earliestStartDate) {
        for (let year = earliestStartDate; year < locationStartYear; year++) {
          segments.unshift({ year, status: "not-moved-in" });
        }
      }

      if (location.end_date && locationEndYear < currentYear) {
        for (let year = locationEndYear + 1; year <= currentYear; year++) {
          segments.push({ year, status: "former" });
        }
      }

      return {
        locationId: location.id,
        locationName: location.name,
        segments,
      };
    } catch (error) {
      // Return a default timeline for this location to prevent the entire map from failing
      return {
        locationId: location.id,
        locationName: location.name,
        segments: [],
      };
    }
  });
}

export const LocationTimelineProvider: React.FC<{
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
        locationTimelines: [],
        isLoading: false,
        error: null,
        getFilteredLocationTimelines: () => [],
      };
    }

    try {
      const timelines = generateLocationTimelines(
        familyData.locations,
        familyData.moments
      );
      return {
        locationTimelines: timelines,
        isLoading: isFamilyLoading,
        error: null,
        getFilteredLocationTimelines: (petId?: number) => {
          return generateLocationTimelines(
            familyData.locations,
            familyData.moments,
          );
        },
      };
    } catch (err) {
      return {
        locationTimelines: [],
        isLoading: false,
        error: err instanceof Error ? err : new Error("An error occurred"),
        getFilteredLocationTimelines: () => [],
      };
    }
  }, [familyData, familyId, isFamilyLoading]);

  return (
    <LocationTimelineContext.Provider value={contextValue}>
      {children}
    </LocationTimelineContext.Provider>
  );
};

export const useLocationTimelineContext = () => {
  const context = useContext(LocationTimelineContext);
  if (!context) {
    throw new Error(
      "useLocationTimelineContext must be used within a LocationTimelineProvider"
    );
  }
  return context;
};

export default LocationTimelineProvider;
