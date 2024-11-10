import React from "react";
import Link from "@/components/Link";
import SvgPattern from "@/components/SvgPattern";
import TimelineCell from "@/components/TimelineCell";
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
    <div className="relative flex flex-col" id={`col-${item.id}`}>
      {/* Background Pattern */}
      <div className="absolute w-full h-full z-0">
        <SvgPattern patternId={patternId} />
      </div>

      {/* Cells */}
      {rowHeaders.map((year) => (
        <div key={year} className="w-20 h-10">
          {getCellContent(year)}
        </div>
      ))}

      {/* Row Header - now sticky right */}
      <div
        className={`sticky right-0 z-20 w-20 h-10 flex items-center justify-center font-bold ${headerStyle}`}
      >
        <Link href={`${baseURL}/pet/${item.id}`}>{item.name}</Link>
      </div>
    </div>
  );
};

export default PetTimelineColumn;
