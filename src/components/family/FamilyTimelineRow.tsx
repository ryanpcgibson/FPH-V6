import React from "react";
import Link from "@/components/Link";
import SvgPattern from "@/components/SvgPattern";
import FamilyTimelineCell from "@/components/family/FamilyTimelineCell";
import type { TimelineItem } from "@/types/timeline";

interface TimelineRowProps {
  item: TimelineItem;
  columnHeaders: number[];
  baseURL: string;
  patternId: string;
  onSegmentClick?: (itemId: number, momentId?: number) => void;
  headerStyle: string;
}

const TimelineRow: React.FC<TimelineRowProps> = ({
  item,
  columnHeaders,
  baseURL,
  patternId,
  onSegmentClick,
  headerStyle,
}) => {
  const getCellContent = (year: number) => {
    const segment = item.segments.find((s) => s.year === year);
    return (
      <FamilyTimelineCell
        segment={segment}
        petId={item.id}
        onClick={onSegmentClick}
      />
    );
  };

  return (
    <div className="relative flex" id={`row-${item.id}`}>
      {/* Background Pattern */}
      <div className="absolute w-full h-full z-0">
        <SvgPattern patternId={patternId} />
      </div>

      {/* Cells */}
      {columnHeaders.map((year) => (
        <div key={year} className="w-20 h-10">
          {getCellContent(year)}
        </div>
      ))}

      {/* Wrapper div with white background to hide pattern */}
      <div className="sticky right-0 z-20 w-28 h-10 flex items-center justify-center bg-white">
        <div
          className={`w-full h-full flex items-center justify-center font-bold rounded-lg ${headerStyle}`}
        >
          <Link href={`${baseURL}/pet/${item.id}`}>{item.name}</Link>
        </div>
      </div>
    </div>
  );
};

export default TimelineRow;
