import React from "react";
import Link from "@/components/Link";
import SvgPattern from "@/components/SvgPattern";
import TimelineCell from "@/components/TimelineCell";
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
      <TimelineCell
        segment={segment}
        itemId={item.id}
        onClick={onSegmentClick}
      />
    );
  };

  console.log(`item: ${item.id} (${item.segments.length}) `, item);
  return (
    <div className="relative flex" data-testid={`row-${item.id}`}>
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

      {/* Row Header - now sticky right */}
      <div
        className={`sticky right-0 z-20 w-20 h-10 flex items-center justify-center font-bold ${headerStyle}`}
      >
        <Link href={`${baseURL}/pet/${item.id}`}>{item.name}</Link>
      </div>
    </div>
  );
};

export default TimelineRow;
