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
  cellWidth: number;
  headerWidth: number;
}

const TimelineRow: React.FC<TimelineRowProps> = ({
  item,
  columnHeaders,
  patternId,
  headerStyle,
  getSegmentUrl,
  sectionId,
  cellWidth,
  headerWidth,
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
    <div
      className="relative flex w-full justify-end items-center"
      id={`${sectionId}-row-${item.id}`}
    >
      {/* Background Pattern */}
      {/* // TODO make height dynamic */}
      <div
        className={"absolute h-[28px] z-0 border-y-2 border-white box-content"}
        style={{
          width: ` ${headerWidth + cellWidth * columnHeaders.length}px `,
        }}
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

      {/* Sticky row header */}
      <div
        className="h-10 sticky right-0 z-20 flex items-center bg-card justify-between px-2 border-b border-foreground"
        style={{ width: `${headerWidth}px` }}
        id={`${sectionId}-row-${item.id}-entity-link`}
      >
        <EntityLink item={item} itemType={sectionId} />
      </div>
    </div>
  );
};

export default TimelineRow;
