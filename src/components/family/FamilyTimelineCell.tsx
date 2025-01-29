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

  let cellClass =
    "w-full h-full cursor-pointer relative overflow-hidden box-border";

  if (
    hasStatus([
      "alive",
      "alive-with-memory",
      "birth",
      "birth-with-memory",
      "birth-and-death",
      "birth-and-death-with-memory",
      "death",
      "death-with-memory",
      "memory",
      "move-in",
      "move-in-with-memory",
      "move-in-and-out",
      "move-in-and-out-with-memory",
      "residing",
      "residing-with-memory",
      "move-out",
      "move-out-with-memory",
    ])
  ) {
    cellClass += " bg-opacity-0 border-t-2 border-b-2 border-black";
  } else {
    cellClass += " bg-white";
  }

  if (
    hasStatus([
      "birth",
      "birth-and-death",
      "birth-with-memory",
      "birth-and-death-with-memory",
      "move-in",
      "move-in-with-memory",
      "move-in-and-out",
      "move-in-and-out-with-memory",
    ])
  ) {
    cellClass += " border-l-2";
  }

  if (
    hasStatus([
      "death",
      "birth-and-death",
      "death-with-memory",
      "birth-and-death-with-memory",
      "move-out",
      "move-out-with-memory",
      "move-in-and-out",
      "move-in-and-out-with-memory",
    ])
  ) {
    cellClass += " border-r-2";
  }

  // DEBUGGING
  // cellClass =
  //   "w-full h-full cursor-pointer relative overflow-hidden box-content border border-red-700";

  return (
    <div className={cellClass} onClick={handleClick}>
      {hasStatus(["deceased", "former"]) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-[2px] bg-gray-300"></div>
        </div>
      )}
      {hasStatus([
        "memory",
        "birth-with-memory",
        "birth-and-death-with-memory",
        "alive-with-memory",
        "death-with-memory",
        "move-in-with-memory",
        "residing-with-memory",
        "move-out-with-memory",
        "move-in-and-out-with-memory",
      ]) && (
        <div className="relative flex items-center justify-center h-full">
          <ColoredHeartIcon
            size={18}
            fillColor="#ff0000"
            outlineColor="black"
          />
        </div>
      )}
    </div>
  );
};

export default FamilyTimelineCell;
