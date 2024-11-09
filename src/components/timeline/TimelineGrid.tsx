import React, { useRef, useEffect, useImperativeHandle } from "react";
import TimelineHeader from "@/components/timeline/TimelineHeader";
import TimelineSection from "@/components/timeline/TimelineSection";
import { useTimelineSections } from "@/hooks/useTimelineSections";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { useNavigate } from "react-router-dom";
import { calculateYearScrollPosition } from "@/utils/timelineUtils";

export interface TimelineGridHandle {
  scrollToYear: (year: number) => void;
}

const TimelineGrid = React.forwardRef<TimelineGridHandle>((props, ref) => {
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleSegmentClick = (itemId: number, momentId?: number) => {
    if (momentId) {
      navigate(`/pet/${itemId}`, { state: { momentId } });
    }
  };
  const { sections, yearsArray } = useTimelineSections();
  const minWidth = (yearsArray.length + 1) * 80;

  const { familyId } = useFamilyDataContext();
  const baseURL = `/app/family/${familyId}`;

  const scrollToYear = (year: number) => {
    if (gridContainerRef.current) {
      const scrollPosition = calculateYearScrollPosition(year, yearsArray);
      gridContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  // Scroll to current year on mount
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    scrollToYear(currentYear);
  }, [yearsArray]);

  useImperativeHandle(ref, () => ({
    scrollToYear,
  }));

  return (
    <div
      ref={gridContainerRef}
      className="w-full flex-grow overflow-auto"
      id="timeline-grid"
    >
      <div
        className="relative"
        style={{ minWidth: `${minWidth}px`, width: `${minWidth}px` }}
        id="grid-content"
      >
        <TimelineHeader columnHeaders={yearsArray} />

        {sections.map((section, index) => (
          <TimelineSection
            key={section.id}
            section={section}
            columnHeaders={yearsArray}
            baseURL={baseURL}
            onSegmentClick={section.onSegmentClick}
          />
        ))}
      </div>
    </div>
  );
});

export default TimelineGrid;
