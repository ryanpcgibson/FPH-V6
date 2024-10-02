import React from "react";
import { PetTimelineSegment } from "@/context/PetTimelineContext";

interface TimelineCellProps {
  segment: PetTimelineSegment | undefined;
  year: number;
  petId: number;
  onClick: (petId: number, momentId?: number) => void;
}

const TimelineCell: React.FC<TimelineCellProps> = ({ segment, year, petId, onClick }) => {
  const handleClick = () => {
    onClick(petId, segment?.moments?.[0]?.id);
  };

  let cellContent;
  let cellClass = "w-24 h-6 cursor-pointer min-w-[6rem]"; // Added min-w-[6rem]

  if (segment) {
    switch (segment.status) {
      case "birth":
        cellContent = "🐣";
        cellClass += " bg-green-300";
        break;
      case "alive":
        cellContent = "🐾";
        cellClass += " bg-green-200";
        break;
      case "death":
        cellContent = "🌈";
        cellClass += " bg-gray-300";
        break;
      case "memory":
        cellContent = "📸";
        cellClass += " bg-blue-200";
        break;
      case "not-born":
        cellContent = "";
        cellClass += " bg-gray-100";
        break;
      case "deceased":
        cellContent = "";
        cellClass += " bg-gray-200";
        break;
      default:
        cellContent = "•";
        cellClass += " bg-yellow-200";
    }
  } else {
    cellContent = "";
    cellClass += " bg-white";
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
