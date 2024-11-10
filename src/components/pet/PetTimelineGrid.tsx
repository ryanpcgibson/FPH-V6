import React, { useRef, useEffect, useImperativeHandle } from "react";
import PetTimelineSection from "@/components/pet/PetTimelineSection";
import { useTimelineSections } from "@/hooks/useTimelineSections";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { useNavigate } from "react-router-dom";
import { calculateYearScrollPosition } from "@/utils/timelineUtils";
import PetTimelineHeader from "@/components/pet/PetTimelineHeader";
export interface TimelineGridHandle {
  scrollToYear: (year: number) => void;
}

const PetTimelineGrid = React.forwardRef<TimelineGridHandle>((props, ref) => {
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
      className="w-full flex-grow overflow-auto border-red-500 border-2"
      id="pet-detail-timeline-grid"
    >
      <div
        className="relative"
        style={{ minWidth: `${minWidth}px`, width: `${minWidth}px` }}
        id="grid-content"
      >
        <PetTimelineHeader rowHeaders={yearsArray} />
        {sections.map((section, index) => (
          <PetTimelineSection
            key={section.id}
            section={section}
            rowHeaders={yearsArray}
            baseURL={baseURL}
            onSegmentClick={section.onSegmentClick}
          />
        ))}
      </div>
    </div>
  );
});

export default PetTimelineGrid;
