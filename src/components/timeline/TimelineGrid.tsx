import React, { useRef, useEffect, useImperativeHandle } from "react";
import TimelineHeader from "@/components/timeline/TimelineHeader";
import TimelineSection from "@/components/timeline/TimelineSection";
import { useTimelineSections } from "@/hooks/useTimelineSections";
import { usePetTimelineContext } from "@/context/PetTimelineContext";
import { useLocationTimelineContext } from "@/context/LocationTimelineContext";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { useNavigate } from "react-router-dom";
import { calculateYearScrollPosition } from "@/utils/timelineUtils";

export interface TimelineGridHandle {
  scrollToYear: (year: number) => void;
}

const TimelineGrid = React.forwardRef<TimelineGridHandle>((props, ref) => {
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const { petTimelines } = usePetTimelineContext();
  const { locationTimelines } = useLocationTimelineContext();
  const navigate = useNavigate();

  const handleSegmentClick = (itemId: number, momentId?: number) => {
    if (momentId) {
      navigate(`/pet/${itemId}`, { state: { momentId } });
    }
  };
  const { sections, columnHeaders, minWidth } = useTimelineSections();
  const { familyId } = useFamilyDataContext();
  const baseURL = `/app/family/${familyId}`;

  console.log(`petTimelines: (${petTimelines.length})`, petTimelines);
  console.log(
    `locationTimelines: (${locationTimelines.length})`,
    locationTimelines
  );

  const scrollToYear = (year: number) => {
    if (gridContainerRef.current) {
      const scrollPosition = calculateYearScrollPosition(year, columnHeaders);
      gridContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  // Scroll to current year on mount
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    scrollToYear(currentYear);
  }, [columnHeaders]);

  useImperativeHandle(ref, () => ({
    scrollToYear
  }));

  return (
    <div
      ref={gridContainerRef}
      className="w-full flex-grow overflow-auto"
      data-testid="double-scroll-grid-container"
    >
      <div
        className="relative"
        style={{ minWidth: `${minWidth}px`, width: `${minWidth}px` }}
        data-testid="grid-content"
      >
        <TimelineHeader columnHeaders={columnHeaders} />

        {sections.map((section, index) => (
          <TimelineSection
            key={section.id}
            section={section}
            columnHeaders={columnHeaders}
            baseURL={baseURL}
            onSegmentClick={section.onSegmentClick}
          />
        ))}
      </div>
    </div>
  );
});

export default TimelineGrid;
