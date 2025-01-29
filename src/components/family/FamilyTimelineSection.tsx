import React from "react";
import TimelineRow from "./FamilyTimelineRow";
import type { TimelineSection as TimelineSectionType } from "@/types/timeline";

interface TimelineSectionProps {
  section: TimelineSectionType;
  columnHeaders: number[];
  getSegmentUrl?: (
    baseURL: string,
    itemId: number,
    momentId?: number
  ) => string;
  cellWidth: number;
  headerWidth: number;
}

const TimelineSection: React.FC<TimelineSectionProps> = ({
  section,
  columnHeaders,
  getSegmentUrl,
  cellWidth,
  headerWidth,
}) => {
  return (
    <div className="w-full" id={`${section.id}-section`}>
      {section.items.map((item, index) => (
        <TimelineRow
          key={`${section.id}-${item.id}`}
          item={item}
          sectionId={section.id}
          columnHeaders={columnHeaders}
          patternId={section.patternIds[index % section.patternIds.length]}
          getSegmentUrl={getSegmentUrl}
          headerStyle={section.headerStyle}
          cellWidth={cellWidth}
          headerWidth={headerWidth}
        />
      ))}
    </div>
  );
};

export default TimelineSection;
