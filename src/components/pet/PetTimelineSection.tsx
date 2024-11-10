import React from "react";
import PetTimelineColumn from "@/components/pet/PetTimelineColumn";
import type { TimelineSection as TimelineSectionType } from "@/types/timeline";
interface PetTimelineSectionProps {
  section: TimelineSectionType;
  rowHeaders: number[];
  baseURL: string;
  onSegmentClick?: (itemId: number, momentId?: number) => void;
}

const PetTimelineSection: React.FC<PetTimelineSectionProps> = ({
  section,
  rowHeaders,
  baseURL,
  onSegmentClick,
}) => {
  return (
    <div className="relative space-y-1 pt-1" id="grid-body">
      {section.items.map((item, index) => (
        <PetTimelineColumn
          key={item.id}
          item={item}
          rowHeaders={rowHeaders}
          baseURL={baseURL}
          patternId={section.patternIds[index % section.patternIds.length]}
          onSegmentClick={onSegmentClick}
          headerStyle={section.headerStyle}
        />
      ))}
    </div>
  );
};

export default PetTimelineSection;
