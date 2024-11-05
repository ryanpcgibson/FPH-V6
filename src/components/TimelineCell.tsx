import React from "react";
import { PetTimelineSegment } from "@/context/PetTimelineContext";
import StarIcon from "@/components/StarIcon";

interface TimelineCellProps {
  segment: PetTimelineSegment | undefined;
  petId: number;
  onClick: (petId: number, momentId?: number) => void;
}

const TimelineCell: React.FC<TimelineCellProps> = ({
  segment,
  petId,
  onClick,
}) => {
  const handleClick = () => {
    onClick(petId, segment?.moments?.[0]?.id);
  };

  let cellClass = "w-full h-full cursor-pointer relative overflow-hidden";

  switch (segment?.status) {
    case "birth":
    case "alive":
    case "death":
    case "memory":
      cellClass += " bg-opacity-0 border-t-2 border-b-2 border-black"; // Make the cell transparent to show the pattern
      break;
    default:
      cellClass += " bg-white"; // Cover the pattern with white background
  }

  if (segment?.status === "birth") {
    cellClass += " border-l-2 border-black ";
  } else if (segment?.status === "death") {
    cellClass += " border-r-2 border-black";
  }

  return (
    <div className={cellClass} onClick={handleClick}>
      {segment?.status === "deceased" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-[2px] bg-gray-300"></div>
        </div>
      )}
      <div className="relative flex items-center justify-center h-full">
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
