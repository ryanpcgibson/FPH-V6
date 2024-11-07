import React from "react";
import { useNavigate } from "react-router-dom";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import TimelineGrid from "./timeline/TimelineGrid";
import { useTimelineSections } from "@/hooks/useTimelineSections";

interface TimelineBarsProps {
  petTimelines: PetTimeline[];
  locationTimelines?: LocationTimeline[];
  petId?: number;
  className?: string;
}

const TimelineBars: React.FC<TimelineBarsProps> = ({
  petTimelines,
  locationTimelines = [],
  petId,
}) => {
  const { familyId } = useFamilyDataContext();
  const navigate = useNavigate();
  const baseURL = `/app/family/${familyId}`;

  const sections = useTimelineSections({
    petTimelines,
    locationTimelines,
    petId,
  });

  const handleSegmentClick = (itemId: number, momentId?: number) => {
    const url = `${baseURL}/pet/${itemId}`;
    if (momentId) {
      navigate(url, { state: { momentId } });
    }
  };

  return (
    <TimelineGrid
      sections={sections}
      baseURL={baseURL}
      onSegmentClick={handleSegmentClick}
    />
  );
};

export default TimelineBars;
