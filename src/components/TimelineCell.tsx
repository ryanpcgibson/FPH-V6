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

  let cellClass = "w-full h-full cursor-pointer relative overflow-hidden";
  let patternClass = "absolute inset-0 bg-gray-100";

  if (segment) {
    switch (segment.status) {
      case "birth":
        cellClass += " rounded-l-full";
        patternClass += " rounded-l-full";
        break;
      case "death":
        cellClass += " rounded-r-full";
        patternClass += " rounded-r-full";
        break;
      case "not-born":
      case "deceased":
        cellClass += " bg-white";
        break;
    }
  } else {
    cellClass += " bg-white";
  }

  // Add background colors
  // if (segment?.status === "birth") cellClass += " bg-blue-500";
  // if (segment?.status === "death") cellClass += " bg-red-500";

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
