import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { PetTimeline, PetTimelineSegment } from "@/context/PetTimelineContext";
import { useFamilyDataContext } from "@/context/FamilyDataContext";

interface TimelineBarsProps {
  petTimelines: PetTimeline[];
  petId?: number;
}

const TimelineCell: React.FC<{
  segment: PetTimelineSegment | undefined;
  year: number;
  petId: number;
  onClick: (petId: number, momentId?: number) => void;
}> = ({ segment, year, petId, onClick }) => {
  const getStatusColor = (status: PetTimelineSegment["status"]) => {
    switch (status) {
      case "not-born":
        return "bg-gray-200";
      case "alive":
        return "bg-green-500";
      case "memory":
        return "bg-blue-500";
      case "deceased":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div
      className={`h-12 w-24 ${
        segment ? getStatusColor(segment.status) : "bg-gray-100"
      } border border-white cursor-pointer flex items-center justify-center`}
      title={segment?.status}
      onClick={() => onClick(petId, segment?.moments?.[0]?.id)}
    ></div>
  );
};

const TimelineBars: React.FC<TimelineBarsProps> = ({ petTimelines, petId }) => {
  const { familyId } = useFamilyDataContext();
  const navigate = useNavigate();
  console.log(petTimelines);
  const handleSegmentClick = (petId: number, momentId?: number) => {
    const url = `/app/family/${familyId}/pet/${petId}`;
    if (momentId) {
      navigate(url, { state: { momentId } });
    } else {
      navigate(url);
    }
  };

  const timelinesToRender = petId
    ? petTimelines.filter((timeline) => timeline.petId === petId)
    : petTimelines;

  console.log(timelinesToRender);

  const allYears = timelinesToRender.flatMap((timeline) =>
    timeline.segments.map((segment) => segment.year)
  );
  const minYear = Math.min(...allYears);
  const maxYear = Math.max(...allYears);
  const yearRange = maxYear - minYear + 1;

  return (
    <div>
      <div className="overflow-x-auto">
        <div
          className="inline-grid gap-px"
          style={{
            gridTemplateColumns: `${
              petId ? "" : "auto"
            } repeat(${yearRange}, 100px)`,
          }}
        >
          {!petId && <div className="w-40"></div>}
          {Array.from({ length: yearRange }, (_, i) => minYear + i).map(
            (year) => (
              <div key={year} className="text-xs text-center w-24">
                {year}
              </div>
            )
          )}
          {timelinesToRender.map((timeline) => (
            <React.Fragment key={timeline.petId}>
              {!petId && (
                <div className="text-sm font-semibold pr-2 whitespace-nowrap w-40 flex items-center">
                  <Link
                    to={`/app/family/${familyId}/pet/${timeline.petId}`}
                    className="hover:underline"
                  >
                    {timeline.petName}
                  </Link>
                </div>
              )}
              {Array.from({ length: yearRange }, (_, i) => minYear + i).map(
                (year) => {
                  const segment = timeline.segments.find(
                    (s) => s.year === year
                  );
                  return (
                    <TimelineCell
                      key={year}
                      segment={segment}
                      year={year}
                      petId={timeline.petId}
                      onClick={handleSegmentClick}
                    />
                  );
                }
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineBars;
