import React, { useRef, useEffect } from "react";
import { useTimelineSections } from "@/hooks/useTimelineSections";
import TimelineHeader from "@/components/TimelineHeader";
import FamilyTimelineSection from "@/components/family/FamilyTimelineSection";
import AddItemButton from "@/components/AddItemButton";
import { calculateYearScrollPosition } from "@/utils/timelineUtils";

const cellWidth = 80;
const headerWidth = 110;

const FamilyTimelinePage: React.FC = () => {
  const gridInnerRef = useRef<HTMLDivElement>(null);

  const { sections, yearsArray } = useTimelineSections();
  const minWidth = (yearsArray.length + 1) * cellWidth + headerWidth;

  const scrollToYear = (year: number) => {
    if (gridInnerRef.current) {
      const scrollPosition = calculateYearScrollPosition(year, yearsArray);
      gridInnerRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      gridInnerRef.current.scrollLeft = scrollPosition;
    }
  };

  // Scroll to current year on mount
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    scrollToYear(currentYear);
  }, [yearsArray]);



  return (
    <div className="flex flex-row" id="page-container">
      <div
        className="w-full max-h-[454px] flex-grow overflow-x-auto"
        id="family-timeline-grid"
        ref={gridInnerRef}
      >
        <div
          className="relative"
          style={{ minWidth: `${minWidth}px`, width: `${minWidth}px` }}
          id="grid-content"
        >
          <TimelineHeader
            headerTexts={yearsArray.map(String)}
            cellWidth={cellWidth}
          />
          <div
            className="relative w-full flex flex-col"
            id="grid-content-inner"
          >
            {Object.values(sections).map((section) => (
              <FamilyTimelineSection
                key={section.id}
                section={section}
                columnHeaders={yearsArray}
                getSegmentUrl={section.getSegmentUrl}
                cellWidth={cellWidth}
                headerWidth={headerWidth}
              />
            ))}
            <AddItemButton headerWidth={headerWidth} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyTimelinePage;
