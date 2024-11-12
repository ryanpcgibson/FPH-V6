import React from "react";
import type { TimelineSegment } from "@/types/timeline";
import StarIcon from "@/components/StarIcon";

interface TimelineCellProps {
  segment: TimelineSegment | undefined;
  petId: number;
  onClick: (petId: number, momentId?: number) => void;
}

const FamilyTimelineCell: React.FC<TimelineCellProps> = ({
  segment,
  petId,
  onClick,
}) => {
  const hasStatus = (statuses: string | string[]): boolean => {
    if (!segment?.status) return false;
    return Array.isArray(statuses)
      ? statuses.includes(segment.status)
      : segment.status === statuses;
  };

  const handleClick = () => {
    onClick(petId, segment?.moments?.[0]?.id);
  };

  let cellClass = "w-full h-full cursor-pointer relative overflow-hidden";

  if (
    hasStatus([
      "birth",
      "birth-and-death",
      "alive",
      "death",
      "memory",
      "move-in",
      "move-in-and-out",
      "residing",
      "move-out",
    ])
  ) {
    cellClass += " bg-opacity-0 border-t-2 border-b-2 border-black";
  } else {
    cellClass += " bg-white";
  }

  if (hasStatus(["birth", "birth-and-death", "move-in", "move-in-and-out"])) {
    cellClass += " border-l-2";
  }

  if (hasStatus(["death", "birth-and-death", "move-out", "move-in-and-out"])) {
    cellClass += " border-r-2";
  }

  return (
    <div className={cellClass} onClick={handleClick}>
      {hasStatus(["deceased", "former"]) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-[2px] bg-gray-300"></div>
        </div>
      )}
      <div className="relative flex items-center justify-center h-full">
        {hasStatus("memory") && (
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

export default FamilyTimelineCell;
