import React from "react";
import { usePetTimelineContext } from "@/context/PetTimelineContext";
import { format } from "date-fns";

interface PetTimelineFactsProps {
  petId: number | null;
  onMomentClick: (momentId: number) => void;
}

const PetTimelineFacts: React.FC<PetTimelineFactsProps> = ({
  petId,
  onMomentClick,
}) => {
  const { getFilteredPetTimelines } = usePetTimelineContext();

  if (!petId) return null;

  const timeline = getFilteredPetTimelines(petId)[0];
  if (!timeline) return null;

  // Find birth and death years from segments
  const birthSegment = timeline.segments.find((s) => s.status === "birth");
  const deathSegment = timeline.segments.find((s) => s.status === "death");

  // Get all moments with their years, sorted by year
  const moments = timeline.segments
    .filter((s) => s.moments && s.moments.length > 0)
    .flatMap((s) =>
      (s.moments || []).map((moment) => ({
        ...moment,
        year: s.year,
      }))
    )
    .sort((a, b) => a.id - b.id);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{timeline.petName}</h2>
      <ul className="space-y-2">
        {birthSegment && <li>Born: {birthSegment.year}</li>}
        {deathSegment && <li>Died: {deathSegment.year}</li>}
        {moments.length > 0 && (
          <>
            <li className="font-semibold mt-4">Moments:</li>
            {moments.map((moment) => (
              <li
                key={moment.id}
                className="ml-4 text-blue-600 hover:text-blue-800 cursor-pointer"
                onClick={() => onMomentClick(moment.id)}
              >
                • {moment.title} ({moment.year})
              </li>
            ))}
          </>
        )}
      </ul>
    </div>
  );
};

export default PetTimelineFacts;
