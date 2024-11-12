import React, { useRef, useEffect, useImperativeHandle } from "react";
import PetTimelineSection from "@/components/pet/PetTimelineSection";
import { useTimelineSections } from "@/hooks/useTimelineSections";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { useNavigate, useParams } from "react-router-dom";
import { calculateYearScrollPosition } from "@/utils/timelineUtils";
import FamilyTimelineHeader from "@/components/family/FamilyTimelineHeader";
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
  const {
    sections: originalSections,
    yearsArray,
    petNames,
    locationNames,
  } = useTimelineSections(petIdNumber);

  // Reverse the sections array and reverse items within each section
  const reversedSections = [...originalSections].reverse().map((section) => ({
    ...section,
    items: [...section.items].reverse(),
  }));

  const columnHeaders = [...petNames, ...locationNames].reverse();
  const minHeight = yearsArray.length * 40;
  const minWidth = (columnHeaders.length + 1) * 80;
  console.log("minHeight", minHeight);
  const { familyId } = useFamilyDataContext();
  const baseURL = `/app/family/${familyId}`;

  return (
    <div
      ref={gridContainerRef}
      className="w-full flex-grow overflow-auto"
      style={{ minWidth: `${minWidth}px` }}
      id="pet-detail-timeline-grid"
    >
      <div
        className="relative"
        style={{ minHeight: `${minHeight}px`, height: `${minHeight}px` }}
        id="grid-content"
      >
        <FamilyTimelineHeader columnHeaders={columnHeaders} />
        <div
          className="flex flex-row flex-grow gap-1"
          style={{ minHeight: `${minHeight}px`, height: `${minHeight}px` }}
        >
          {reversedSections.map((section, index) => (
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
    </div>
  );
});

export default PetTimelineGrid;
