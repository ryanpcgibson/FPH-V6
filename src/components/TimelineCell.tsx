import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { PetTimeline, PetTimelineSegment } from "@/context/PetTimelineContext";
import { useFamilyDataContext } from "@/context/FamilyDataContext";

// ... existing imports and interfaces ...

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
      className={`h-6 ${
        segment ? getStatusColor(segment.status) : "bg-gray-100"
      } border border-white cursor-pointer`}
      title={
        segment?.moments && segment.moments.length > 0
          ? `${year}: ${segment.moments.map((m) => m.title).join(", ")}`
          : segment
          ? `${year}: ${segment.status}`
          : `${year}: No data`
      }
      onClick={() => onClick(petId, segment?.moments?.[0]?.id)}
    />
  );
};

const TimelineBars: React.FC<TimelineBarsProps> = ({
  petTimelines,
  selectedPetId = null,
}) => {
  const { familyId } = useFamilyDataContext();
  const navigate = useNavigate();

  // ... existing code ...

  const handleSegmentClick = (petId: number, momentId?: number) => {
    const url = `/family/${familyId}/pet/${petId}`;
    if (momentId) {
      navigate(url, { state: { momentId } });
    } else {
      navigate(url);
    }
  };

  // ... existing code ...

  return (
    <div className="w-full sm:w-3/5 p-4">
      <div
        className="grid"
        style={{ gridTemplateColumns: `auto repeat(${yearRange}, 1fr)` }}
      >
        {/* ... existing code ... */}
        {timelinesToRender.map((timeline) => (
          <React.Fragment key={timeline.petId}>
            <div className="text-sm font-semibold pr-2">
              <Link
                to={`/family/${familyId}/pet/${timeline.petId}`}
                className="hover:underline"
              >
                {timeline.petName}
              </Link>
            </div>
            {Array.from({ length: yearRange }, (_, i) => minYear + i).map(
              (year) => {
                const segment = timeline.segments.find((s) => s.year === year);
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
  );
};

export default TimelineBars;
