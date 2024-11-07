import { useMemo } from "react";
import type { TimelineSection } from "@/types/timeline";
import type { PetTimeline } from "@/context/PetTimelineContext";
import type { LocationTimeline } from "@/context/LocationTimelineContext";

interface UseTimelineSectionsProps {
  petTimelines: PetTimeline[];
  locationTimelines: LocationTimeline[];
  petId?: number;
}

export const useTimelineSections = ({
  petTimelines,
  locationTimelines,
  petId,
}: UseTimelineSectionsProps) => {
  return useMemo(() => {
    const sections: TimelineSection[] = [];

    // Filter pet timelines if petId is provided
    const filteredPetTimelines = petId
      ? petTimelines.filter((timeline) => timeline.petId === petId)
      : petTimelines;

    // Add pets section
    if (filteredPetTimelines.length > 0) {
      sections.push({
        id: 'pets',
        type: 'pets',
        items: filteredPetTimelines.map(pet => ({
          id: pet.petId,
          name: pet.petName,
          segments: pet.segments
        })),
        patternIds: ['9', '10', '22', '40'],
        headerStyle: 'bg-yellow-400'
      });
    }

    // Add locations section if no specific pet is selected
    if (!petId && locationTimelines.length > 0) {
      sections.push({
        id: 'locations',
        type: 'locations',
        items: locationTimelines.map(location => ({
          id: location.locationId,
          name: location.locationName,
          segments: location.segments
        })),
        patternIds: ['50', '51', '52', '53'],
        headerStyle: 'bg-blue-400'
      });
    }

    return sections;
  }, [petTimelines, locationTimelines, petId]);
}; 