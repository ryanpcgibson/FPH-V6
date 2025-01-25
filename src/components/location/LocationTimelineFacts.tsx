import React from "react";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { format } from "date-fns";
import Link from "@/components/Link";
import { useLocation } from "react-router-dom";

interface LocationTimelineFactsProps {
  locationId: number | null;
  onMomentClick: (momentId: number) => void;
}

const LocationTimelineFacts: React.FC<LocationTimelineFactsProps> = ({
  locationId,
  onMomentClick,
}) => {
  const { familyData, selectedFamilyId } = useFamilyDataContext();

  if (!locationId || !familyData) return null;

  const location = familyData.locations.find((l) => l.id === locationId);
  if (!location) return null;

  const overlappingPets =
    familyData.overlappingPetsForLocations[locationId] || [];

  // Get all moments for this location
  const locationMoments = familyData.moments.filter((moment) =>
    moment.locations?.some((l) => l.id === locationId)
  );

  return (
    <ul className="space-y-2">
      {location.start_date && (
        <li>Moved in: {format(location.start_date, "MMMM d, yyyy")}</li>
      )}
      {location.end_date && (
        <li>Moved out: {format(location.end_date, "MMMM d, yyyy")}</li>
      )}
      {overlappingPets.length > 0 && (
        <>
          <li className="font-semibold mt-4">Pets:</li>
          {overlappingPets.map((pet) => (
            <li key={pet.id} className="ml-4">
              <Link href={`/app/family/${selectedFamilyId}/pet/${pet.id}`}>
                {pet.name}
              </Link>
            </li>
          ))}
        </>
      )}
      {locationMoments.length > 0 && (
        <>
          <li className="font-semibold mt-4">Moments:</li>
          {locationMoments.map((moment) => (
            <li
              key={moment.id}
              className="ml-4 text-blue-600 hover:text-blue-800 cursor-pointer"
              onClick={() => onMomentClick(moment.id)}
            >
              • {moment.title} ({format(moment.start_date!, "MMM d, yyyy")})
            </li>
          ))}
        </>
      )}
    </ul>
  );
};

export default LocationTimelineFacts;
