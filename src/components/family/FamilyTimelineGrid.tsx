import React, { useRef, useEffect, useImperativeHandle } from "react";
import TimelineHeader from "@/components/TimelineHeader";
import FamilyTimelineSection from "@/components/family/FamilyTimelineSection";
import { useTimelineSections } from "@/hooks/useTimelineSections";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { useNavigate } from "react-router-dom";
import { calculateYearScrollPosition } from "@/utils/timelineUtils";
import AddItemButton from "@/components/AddItemButton";

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
    const minWidth = (yearsArray.length + 1) * 80;

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
        className="w-full max-h-[calc(100vh-44px)] flex-grow overflow-auto flex justify-end"
        id="family-timeline-grid"
      >
        <div
          className="relative"
          style={{ minWidth: `${minWidth}px`, width: `${minWidth}px` }}
          id="grid-content"
        >
          {/* <TimelineHeader headerTexts={yearsArray.map(String)} /> */}
          <div
            className="sticky top-0 z-50 bg-white"
            id="column-header-container"
          >
            <div className="flex gap-1" id="column-headers">
              {yearsArray.map(String).map((header, index) => (
                <div
                  key={index}
                  className={`w-[80px] h-10 flex items-center justify-center font-bold rounded-lg ${"bg-gray-200"}`}
                  id={`column-header-${index}`}
                >
                  {header}
                </div>
              ))}
              <div
                className="sticky right-0 z-30 w-28 h-10 flex items-center justify-center font-bold bg-white"
                id="top-right-corner"
              />
            </div>
          </div>
          <div
            ref={gridInnerRef}
            className="w-full relative"
            id="grid-content-inner"
          >
            {Object.values(sections).map((section) => (
              <FamilyTimelineSection
                key={section.id}
                section={section}
                columnHeaders={yearsArray}
                getSegmentUrl={section.getSegmentUrl}
              />
            ))}
            <AddItemButton />
          </div>
        </div>
      </div>
    );
  }
);

export default FamilyTimelineGrid;
