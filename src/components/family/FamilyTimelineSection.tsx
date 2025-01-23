import React from "react";
import TimelineRow from "./FamilyTimelineRow";
import type { TimelineSection as TimelineSectionType } from "@/types/timeline";

interface TimelineSectionProps {
  section: TimelineSectionType;
  columnHeaders: number[];
  getSegmentUrl?: (baseURL: string, itemId: number, momentId?: number) => string;
}

const TimelineSection: React.FC<TimelineSectionProps> = ({
  section,
  columnHeaders,
  getSegmentUrl,
}) => {
  return (
    <div className="relative space-y-1 pt-1" id={`${section.id}-section`}>
      {section.items.map((item, index) => (
        <TimelineRow
          key={item.id}
          item={item}
          columnHeaders={columnHeaders}
          patternId={section.patternIds[index % section.patternIds.length]}
          getSegmentUrl={getSegmentUrl}
          headerStyle={section.headerStyle}
        />
      ))}
    </div>
  );
};

export default TimelineSection;
