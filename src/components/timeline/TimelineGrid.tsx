import React from "react";
import TimelineHeader from "@/components/timeline/TimelineHeader";
import TimelineSection from "@/components/timeline/TimelineSection";
import { useTimelineCalculations } from "@/hooks/useTimelineCalculations";
import type { TimelineSection as TimelineSectionType } from "@/types/timeline";

interface TimelineGridProps {
  sections: TimelineSectionType[];
  baseURL: string;
  onSegmentClick?: (itemId: number, momentId?: number) => void;
}

const TimelineGrid: React.FC<TimelineGridProps> = ({
  sections,
  baseURL,
  onSegmentClick,
}) => {
  const { columnHeaders, minWidth } = useTimelineCalculations(sections);

  sections.forEach((section) => {
    console.log(`section: ${section.id} (${section.items.length})`);
  });

  return (
    <div
      className="w-full flex-grow overflow-auto"
      data-testid="double-scroll-grid-container"
    >
      <div
        className="relative"
        style={{ minWidth: `${minWidth}px`, width: `${minWidth}px` }}
        data-testid="grid-content"
      >
        <TimelineHeader columnHeaders={columnHeaders} />

        {sections.map((section, index) => (
          <TimelineSection
            key={section.id}
            section={section}
            columnHeaders={columnHeaders}
            baseURL={baseURL}
            onSegmentClick={onSegmentClick}
          />
        ))}
      </div>
    </div>
  );
};

export default TimelineGrid;
