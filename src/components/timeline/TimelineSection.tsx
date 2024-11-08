import React from "react";
import TimelineRow from "./TimelineRow";
import type { TimelineSection as TimelineSectionType } from "@/types/timeline";

interface TimelineSectionProps {
  section: TimelineSectionType;
  columnHeaders: number[];
  baseURL: string;
  onSegmentClick?: (itemId: number, momentId?: number) => void;
}

const TimelineSection: React.FC<TimelineSectionProps> = ({
  section,
  columnHeaders,
  baseURL,
  onSegmentClick,
}) => {
  console.log(`section: ${section.id} (${section.items.length})`);

  return (
    <div className="relative space-y-1 pt-1" data-testid="grid-body">
      {section.items.map((item, index) => (
        <TimelineRow
          key={item.id}
          item={item}
          columnHeaders={columnHeaders}
          baseURL={baseURL}
          patternId={section.patternIds[index % section.patternIds.length]}
          onSegmentClick={onSegmentClick}
          headerStyle={section.headerStyle}
        />
      ))}
    </div>
  );
};

export default TimelineSection;
