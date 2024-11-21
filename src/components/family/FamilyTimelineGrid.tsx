import React, { useRef, useEffect, useImperativeHandle } from "react";
import TimelineHeader from "@/components/TimelineHeader";
import FamilyTimelineSection from "@/components/family/FamilyTimelineSection";
import { useTimelineSections } from "@/hooks/useTimelineSections";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { useNavigate, Link } from "react-router-dom";
import { calculateYearScrollPosition } from "@/utils/timelineUtils";
import { Pencil } from "lucide-react";

export interface TimelineGridHandle {
  scrollToYear: (year: number) => void;
}

const FamilyTimelineGrid = React.forwardRef<TimelineGridHandle>(
  (props, ref) => {
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
      // TODO understand this
      scrollToYear,
    }));

    const editFamilyLink = (
      <Link 
        to={`/app/family/${familyId}/edit`}
        className="p-2 hover:bg-yellow-300 transition-colors rounded-md"
        aria-label="Edit Family"
      >
        <Pencil className="h-4 w-4 text-gray-700" />
      </Link>
    );
    return (
      <div
        ref={gridContainerRef}
        className="w-full flex-grow overflow-auto"
        id="family-timeline-grid"
      >
        <div
          className="relative"
          style={{ minWidth: `${minWidth}px`, width: `${minWidth}px` }}
          id="grid-content"
        >
          <TimelineHeader
            headerTexts={yearsArray.map(String)}
            editLink={editFamilyLink}
          />

          {Object.values(sections).map((section) => (
            <FamilyTimelineSection
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
  }
);

export default FamilyTimelineGrid;
