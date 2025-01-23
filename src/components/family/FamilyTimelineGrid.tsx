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

    const handleSegmentClick = (itemId: number, momentId?: number) => {
      if (momentId) {
        navigate(`/pet/${itemId}`, { state: { momentId } });
      }
    };
    const { sections, yearsArray } = useTimelineSections();
    console.log("sections", sections);
    const minWidth = (yearsArray.length + 1) * 80;

    const { selectedFamilyId } = useFamilyDataContext();
    const baseURL = `/app/family/${selectedFamilyId}`;

    const scrollToYear = (year: number) => {
      if (gridInnerRef.current) {
        const scrollPosition = calculateYearScrollPosition(year, yearsArray);
        console.log(
          `Scrolling element:`,
          gridInnerRef.current,
          `\nTo position:`,
          scrollPosition,
          `\nFor year:`,
          year,
          `\nCurrent scroll position:`,
          gridInnerRef.current.scrollLeft,
          `\nScrollWidth:`,
          gridInnerRef.current.scrollWidth,
          `\nClientWidth:`,
          gridInnerRef.current.clientWidth
        );

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

    useImperativeHandle(ref, () => ({
      // TODO understand this
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
                baseURL={baseURL}
                onSegmentClick={section.onSegmentClick}
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
