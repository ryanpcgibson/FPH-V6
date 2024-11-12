import React from "react";
import Link from "@/components/Link";
import SvgPattern from "@/components/SvgPattern";
import TimelineCell from "@/components/pet/PetTimelineCell";
import type { TimelineItem } from "@/types/timeline";

interface PetTimelineColumnProps {
  item: TimelineItem;
  rowHeaders: number[];
  baseURL: string;
  patternId: string;
  onSegmentClick?: (itemId: number, momentId?: number) => void;
  headerStyle: string;
}

const PetTimelineColumn: React.FC<PetTimelineColumnProps> = ({
  item,
  rowHeaders,
  baseURL,
  patternId,
  onSegmentClick,
  headerStyle,
}) => {
  const getCellContent = (year: number) => {
    const segment = item.segments.find((s) => s.year === year);
    return (
      <TimelineCell
        segment={segment}
        itemId={item.id}
        onClick={onSegmentClick}
      />
    );
  };

  return (
    <div
      className="relative flex flex-col items-center w-[80px] min-w-[80px]"
      id={`col-${item.id}`}
    >
      {/* Background Pattern */}
      <div className="absolute w-10 h-full z-0">
        <SvgPattern patternId={patternId} />
      </div>

      {/* Cells */}
      {[...rowHeaders].reverse().map((year) => (
        <div key={year} className="w-10 h-10">
          {getCellContent(year)}
        </div>
      ))}
    </div>
  );
};

export default PetTimelineColumn;
