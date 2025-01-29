import React, { useRef, useEffect, useImperativeHandle } from "react";
import TimelineHeader from "@/components/TimelineHeader";
import FamilyTimelineSection from "@/components/family/FamilyTimelineSection";
import { useTimelineSections } from "@/hooks/useTimelineSections";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { useNavigate } from "react-router-dom";
import { calculateYearScrollPosition } from "@/utils/timelineUtils";
import AddItemButton from "@/components/AddItemButton";

const cellWidth = 80;
const headerWidth = 110;

interface TimelineGridHandle {
  scrollToYear: (year: number) => void;
}

const FamilyTimelineGrid = React.forwardRef<TimelineGridHandle>(
  (props, ref) => {
    const gridInnerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // const handleSegmentClick = (itemId: number, momentId?: number) => {
    //   if (momentId) {
    //     navigate(`/pet/${itemId}`, { state: { momentId } });
    //   }
    // };
    const { sections, yearsArray } = useTimelineSections();
    const minWidth = (yearsArray.length + 1) * cellWidth + headerWidth;

    const { selectedFamilyId } = useFamilyDataContext();

    const scrollToYear = (year: number) => {
      if (gridInnerRef.current) {
        const scrollPosition = calculateYearScrollPosition(year, yearsArray);

        // Try both scrollTo and scrollLeft
        gridInnerRef.current.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });

        // Fallback direct assignment
        gridInnerRef.current.scrollLeft = scrollPosition;
      }
    };

    // Scroll to current year on mount
    useEffect(() => {
      const currentYear = new Date().getFullYear();
      scrollToYear(currentYear);
    }, [yearsArray]);

    // Expose scrollToYear method to parent components via ref - DOM manipulation (e.g. scrolling) is inherently imperative
    useImperativeHandle(ref, () => ({
      scrollToYear,
    }));

    return (
      <div
        className="w-full max-h-[calc(100vh-44px)] flex-grow"
        id="family-timeline-grid"
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
            ref={gridInnerRef}
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
    );
  }
);

export default FamilyTimelineGrid;
