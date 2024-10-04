import React from "react";
import { PetTimelineSegment } from "@/context/PetTimelineContext";

interface TimelineCellProps {
  segment: PetTimelineSegment | undefined;
  year: number;
  petId: number;
  onClick: (petId: number, momentId?: number) => void;
}

const TimelineCell: React.FC<TimelineCellProps> = ({
  segment,
  year,
  petId,
  onClick,
}) => {
  const handleClick = () => {
    onClick(petId, segment?.moments?.[0]?.id);
  };

  let cellContent = "";
  let cellClass = "w-full h-full cursor-pointer min-w-[6rem] ";

  if (segment) {
    switch (segment.status) {
      case "birth":
        cellClass += "bg-gray-200 rounded-l-lg";
        break;
      case "alive":
        cellClass += "bg-gray-200";
        break;
      case "death":
        cellClass += "bg-gray-200 rounded-r-lg";
        break;
      case "memory":
        cellContent = "⭐️";
        cellClass += "bg-gray-200";
        break;
      case "not-born":
        cellClass += "";
        break;
      case "deceased":
        cellClass += "bg-white";
        break;
      default:
        cellClass += "bg-white";
    }
  } else {
    cellClass += "bg-white";
  }

  return (
    <div className={cellClass} onClick={handleClick}>
      <div className="flex items-center justify-center h-full">
        {cellContent}
      </div>
    </div>
  );
};

export default TimelineCell;
