import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { PetTimeline, PetTimelineSegment } from "@/context/PetTimelineContext";
import { useFamilyDataContext } from "@/context/FamilyDataContext";

interface TimelineBarsProps {
  petTimelines: PetTimeline[];
}

const TimelineBars: React.FC<TimelineBarsProps> = ({ petTimelines }) => {
  const { familyId } = useFamilyDataContext();
  const navigate = useNavigate();

  console.log(petTimelines);
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

  const handleSegmentClick = (petId: number, momentId?: number) => {
    const url = `/family/${familyId}/pet/${petId}`;
    if (momentId) {
      navigate(url, { state: { momentId } });
    } else {
      navigate(url);
    }
  };

  const allYears = petTimelines.flatMap((timeline) =>
    timeline.segments.map((segment) => segment.year)
  );
  const minYear = Math.min(...allYears);
  const maxYear = Math.max(...allYears);
  const yearRange = maxYear - minYear + 1;

  return (
    <div className="w-full sm:w-3/5 p-4">
      <div
        className="grid"
        style={{ gridTemplateColumns: `auto repeat(${yearRange}, 1fr)` }}
      >
        <div></div>
        {Array.from({ length: yearRange }, (_, i) => minYear + i).map(
          (year) => (
            <div key={year} className="text-xs text-center">
              {year}
            </div>
          )
        )}
        {petTimelines.map((timeline) => (
          <React.Fragment key={timeline.petId}>
            <div className="text-sm font-semibold pr-2">
              <Link to={`/family/${familyId}/pet/${timeline.petId}`} className="hover:underline">
                {timeline.petName}
              </Link>
            </div>
            {Array.from({ length: yearRange }, (_, i) => minYear + i).map(
              (year) => {
                const segment = timeline.segments.find((s) => s.year === year);
                return (
                  <div
                    key={year}
                    className={`h-6 ${
                      segment ? getStatusColor(segment.status) : "bg-gray-100"
                    } border border-white cursor-pointer`}
                    title={
                      segment?.moments && segment.moments.length > 0
                        ? `${year}: ${segment.moments.map(m => m.title).join(", ")}`
                        : segment ? `${year}: ${segment.status}` : `${year}: No data`
                    }
                    onClick={() => handleSegmentClick(timeline.petId, segment?.moments?.[0]?.id)}
                  />
                );
              }
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default TimelineBars;
