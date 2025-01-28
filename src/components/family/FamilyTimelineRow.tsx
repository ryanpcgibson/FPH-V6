import React from "react";
import SvgPattern from "@/components/SvgPattern";
import FamilyTimelineCell from "@/components/family/FamilyTimelineCell";
import type { TimelineItem } from "@/types/timeline";
import { useLocation } from "react-router-dom";
import EntityLink from "../EntityLink";
import { Separator } from "@radix-ui/react-dropdown-menu";

interface TimelineRowProps {
  item: TimelineItem;
  columnHeaders: number[];
  patternId: string;
  getSegmentUrl?: (
    baseURL: string,
    itemId: number,
    momentId?: number
  ) => string;
  headerStyle: string;
  sectionId: string;
}

const TimelineRow: React.FC<TimelineRowProps> = ({
  item,
  columnHeaders,
  patternId,
  headerStyle,
  getSegmentUrl,
  sectionId,
}) => {
  const getCellContent = (year: number) => {
    const segment = item.segments.find((s) => s.year === year);
    return (
      <FamilyTimelineCell
        segment={segment}
        itemId={item.id}
        getSegmentUrl={getSegmentUrl}
      />
    );
  };
  const location = useLocation();
  const url = getSegmentUrl ? getSegmentUrl(location.pathname, item.id) : "";

  return (
    <div className="relative flex w-full" id={`${sectionId}-row-${item.id}`}>
      {/* Background Pattern */}
      <div
        className="absolute w-full h-full z-0 py-1"
        id={`${sectionId}-row-${item.id}-pattern`}
      >
        <SvgPattern patternId={patternId} />
      </div>

      {/* Cells */}
      {columnHeaders.map((year) => (
        <div key={year} className="w-20 h-10 py-1">
          {getCellContent(year)}
        </div>
      ))}

      {/* Wrapper div with white background to hide pattern */}
      <div className="sticky right-0 z-20 w-28 h-10 flex items-center justify-center bg-white">
        <div
          className={`w-full h-full flex items-center justify-between px-2 ${headerStyle} border-b border-gray-200`}
          id={`${sectionId}-row-${item.id}-header`}
        >
          {/* <Link to={url}>{item.name}</Link> */}
          <EntityLink item={item} itemType={sectionId} />
        </div>
      </div>
    </div>
  );
};

export default TimelineRow;
