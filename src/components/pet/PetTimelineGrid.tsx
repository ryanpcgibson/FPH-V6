import React, { useRef, useEffect, useImperativeHandle } from "react";
import PetTimelineSection from "@/components/pet/PetTimelineSection";
import { useTimelineSections } from "@/hooks/useTimelineSections";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { useNavigate, useParams } from "react-router-dom";
import { calculateYearScrollPosition } from "@/utils/timelineUtils";
import TimelineHeader from "@/components/TimelineHeader";
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

  const columnHeaders: string[] = [];
  const headerStyles: string[] = [];

  if (sections.locations) {
    columnHeaders.push(...sections.locations.items.map((item) => item.name));
    headerStyles.push(
      ...sections.locations.items.map(() => sections.locations.headerStyle)
    );
  }
  if (sections.pets) {
    columnHeaders.push(...sections.pets.items.map((item) => item.name));
    headerStyles.push(
      ...sections.pets.items.map(() => sections.pets.headerStyle)
    );
  }

  const minHeight = yearsArray.length * 40;
  const minWidth = (columnHeaders.length + 1) * 80;
  console.log("minHeight", minHeight);
  const { selectedFamilyId } = useFamilyDataContext();
  const baseURL = `/app/family/${selectedFamilyId}`;

  // TODO extend to scroll vertically to year also. This is working, but actually scrolling to "last" pet so at a minimum is mis-named.
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
    // TODO understand this
    scrollToYear,
  }));



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
        <TimelineHeader
          headerTexts={columnHeaders}
          headerStyles={headerStyles}
        />
        <div
          className="flex flex-row flex-grow gap-1"
          style={{ minHeight: `${minHeight}px`, height: `${minHeight}px` }}
        >
          {Object.values(sections).map((section) => (
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
