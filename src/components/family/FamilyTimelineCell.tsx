import React from "react";
import type { TimelineSegment } from "@/types/timeline";
import { HeartIcon, HeartFilledIcon } from "@radix-ui/react-icons";
import ColoredHeartIcon from "@/components/ColoredHeartIcon";

import { useNavigate, useLocation } from "react-router-dom";

interface TimelineCellProps {
  segment: TimelineSegment | undefined;
  itemId: number;
  getSegmentUrl?: (
    baseURL: string,
    itemId: number,
    momentId?: number
  ) => string;
}

const FamilyTimelineCell: React.FC<TimelineCellProps> = ({
  segment,
  itemId,
  getSegmentUrl,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const hasStatus = (statuses: string | string[]): boolean => {
    if (!segment?.status) return false;
    return Array.isArray(statuses)
      ? statuses.includes(segment.status)
      : segment.status === statuses;
  };

  const handleClick = () => {
    if (!getSegmentUrl) return;
    const url = getSegmentUrl(
      location.pathname,
      itemId,
      segment?.moments?.[0]?.id
    );
    navigate(url);
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
      {hasStatus("memory") && (
        <div className="relative flex items-center justify-center h-full">
          <ColoredHeartIcon
            size={24}
            fillColor="#ff0000"
            outlineColor="black"
          />
        </div>
      )}
    </div>
  );
};

export default FamilyTimelineCell;
