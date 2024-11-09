import React from "react";
import { Link } from "react-router-dom";
import { PetTimeline } from "@/context/PetTimelineContext";
import TimelineCell from "./TimelineCell";

const DEBUG_BORDER1 = "border border-red-500";

interface TimelineBarProps {
  isHeader?: boolean;
  timeline?: PetTimeline;
  yearRange: number;
  minYear: number;
  familyId?: string;
  petId?: number;
  onSegmentClick?: (petId: number, momentId?: number) => void;
}

const TimelineBar: React.FC<TimelineBarProps> = ({
  isHeader,
  timeline,
  yearRange,
  minYear,
  familyId,
  petId,
  onSegmentClick,
}) => {
  if (isHeader) {
    return (
      <>
        {Array.from({ length: yearRange }, (_, i) => minYear + i).map(
          (year) => (
            <div key={year} className="text-xs text-center w-24">
              {year}
            </div>
          )
        )}
      </>
    );
  }

  if (!timeline) return null;

  return (
    <React.Fragment>
      {!petId && (
        <div
          className={`text-sm font-semibold pr-2 whitespace-nowrap w-40 flex items-center ${DEBUG_BORDER1}`}
          id="pet-name-cell"
        >
          <Link
            to={`/app/family/${familyId}/pet/${timeline.petId}`}
            className="hover:underline"
          >
            {timeline.petName}
          </Link>
        </div>
      )}
      {Array.from({ length: yearRange }, (_, i) => minYear + i).map((year) => {
        const segment = timeline.segments.find((s) => s.year === year);
        return (
          <TimelineCell
            key={year}
            segment={segment}
            year={year}
            petId={timeline.petId}
            onClick={onSegmentClick || (() => {})}
          />
        );
      })}
    </React.Fragment>
  );
};

export default TimelineBar;
