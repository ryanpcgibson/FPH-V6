/**
 * Manages and organizes timeline data for pets and locations into sections for display in a timeline visualization component. It processes raw timeline data and returns a structured format that can be easily rendered.
 */
import { useMemo } from "react";
import type { TimelineSection } from "@/types/timeline";
import { usePetTimelineContext } from "@/context/PetTimelineContext";
import { useLocationTimelineContext } from "@/context/LocationTimelineContext";
import { useNavigate } from "react-router-dom";

export const useTimelineSections = (petId?: number) => {
  const { petTimelines, getFilteredPetTimelines } = usePetTimelineContext();
  const { locationTimelines } = useLocationTimelineContext();
  const navigate = useNavigate();

  return useMemo(() => {
    const sections: TimelineSection[] = [];
    const filteredPetTimelines = getFilteredPetTimelines(petId);
    // TODO: filter locations for pet

    if (filteredPetTimelines.length > 0) {
      sections.push({
        id: "pets",
        items: filteredPetTimelines.map((pet) => ({
          id: pet.petId,
          name: pet.petName,
          segments: pet.segments,
        })),
        patternIds: ["9", "10", "22", "40"],
        headerStyle: "bg-yellow-400",
        onSegmentClick: (itemId, momentId) => {
          navigate(`/pet/${itemId}`, { state: { momentId } });
        },
      });
    }

    if (!petId && locationTimelines.length > 0) {
      sections.push({
        id: "locations",
        items: locationTimelines.map((location) => ({
          id: location.locationId,
          name: location.locationName,
          segments: location.segments,
        })),
        patternIds: ["9", "10", "22", "40"],
        headerStyle: "bg-blue-400",
        onSegmentClick: (itemId, momentId) => {
          navigate(`/location/${itemId}`, { state: { momentId } });
        },
      });
    }

    const allItems = sections.flatMap((section) => section.items);

    const earliestYear = allItems.reduce(
      (min, item) =>
        item.segments.length > 0 ? Math.min(min, item.segments[0].year) : min,
      Infinity
    );

    const latestYear = allItems.reduce(
      (max, item) =>
        item.segments.length > 0
          ? Math.max(max, item.segments[item.segments.length - 1].year)
          : max,
      -Infinity
    );

    const yearsArray = Array.from(
      { length: latestYear - earliestYear + 1 },
      (_, i) => earliestYear + i
    );

    return {
      sections,
      yearsArray,
    };
  }, [petTimelines, locationTimelines, petId, getFilteredPetTimelines]);
};
