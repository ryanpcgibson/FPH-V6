import React, { useRef, useEffect, useImperativeHandle } from "react";
import PetTimelineSection from "@/components/pet/PetTimelineSection";
import { useTimelineSections } from "@/hooks/useTimelineSections";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { useNavigate, useParams } from "react-router-dom";
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
  const { petId } = useParams<{ petId?: string }>();
  const petIdNumber = petId ? parseInt(petId, 10) : undefined;
  const { sections, yearsArray } = useTimelineSections(petIdNumber);
  const minHeight = (yearsArray.length + 1) * 30;

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
      className="h-full flex-grow overflow-auto"
      id="pet-detail-timeline-grid"
    >
      <div
        className="relative"
        style={{ minHeight: `${minHeight}px`, height: `${minHeight}px` }}
        id="grid-content"
      >
        {sections.map((section, index) => (
          <PetTimelineSection
            key={section.id}
            section={section}
            rowHeaders={yearsArray}
            baseURL={baseURL}
            onSegmentClick={section.onSegmentClick}
          />
        ))}
        <PetTimelineHeader rowHeaders={yearsArray} />
      </div>
    </div>
  );
});

export default PetTimelineGrid;
