import React from "react";
import { PetTimelineSegment } from "@/context/PetTimelineContext";
import SvgPattern from "@/components/SvgPattern";
import StarIcon from "@/components/StarIcon";

interface TimelineCellProps {
  cellWidth: number;
  cellHeight: number;
  row: number;
  col: number;
  segment: PetTimelineSegment | undefined;
  year: number;
  petId: number;
  onClick: (petId: number, momentId?: number) => void;
  patternId: string;
}

const TimelineCell: React.FC<TimelineCellProps> = ({
  cellWidth,
  cellHeight,
  row,
  col,
  segment,
  year,
  petId,
  onClick,
  patternId,
}) => {
  const handleClick = () => {
    onClick(petId, segment?.moments?.[0]?.id);
  };

  let cellClass =
    "w-full h-full cursor-pointer relative overflow-hidden bg-white";
  let patternClass = "absolute inset-0 bg-gray-100";

  switch (segment?.status) {
    case "birth":
    case "alive":
    case "death":
    case "memory":
      cellClass += "  border-black border-t border-b";
      break;
  }

  switch (segment?.status) {
    case "birth":
      cellClass += " border-l";
      break;
    case "death":
      cellClass += " border-r";
      break;
  }

  return (
    <div className={cellClass} onClick={handleClick}>
      {segment &&
        ["birth", "alive", "death", "memory"].includes(segment.status) && (
          <SvgPattern
            patternId={patternId}
            width={cellWidth}
            height={cellHeight}
            className={patternClass}
          />
        )}
      {segment?.status === "deceased" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-px bg-gray-300"></div>
        </div>
      )}
      <div className="relative flex items-center justify-center h-full z-10">
        {segment?.status === "memory" && (
          <StarIcon
            size={24}
            fillColor="yellow"
            strokeColor="black"
            strokeWidth={1}
          />
        )}
      </div>
    </div>
  );
};

export default TimelineCell;
