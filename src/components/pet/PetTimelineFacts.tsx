import React from "react";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { format } from "date-fns";
import Link from "@/components/Link";

interface PetTimelineFactsProps {
  petId: number | null;
  onMomentClick: (momentId: number) => void;
}

const PetTimelineFacts: React.FC<PetTimelineFactsProps> = ({
  petId,
  onMomentClick,
}) => {
  const { familyData, selectedFamilyId } = useFamilyDataContext();

  if (!petId || !familyData) return null;

  const pet = familyData.pets.find((p) => p.id === petId);
  if (!pet) return null;

  const overlappingLocations =
    familyData.overlappingLocationsForPets[petId] || [];

  // Get all moments for this pet
  const petMoments = familyData.moments.filter((moment) =>
    moment.pets?.some((p) => p.id === petId)
  );

  return (
    <ul className="space-y-2">
      {pet.start_date && (
        <li>Born: {format(pet.start_date, "MMMM d, yyyy")}</li>
      )}
      {pet.end_date && <li>Died: {format(pet.end_date, "MMMM d, yyyy")}</li>}
      {overlappingLocations.length > 0 && (
        <>
          <li className="font-semibold mt-4">Locations:</li>
          {overlappingLocations.map((location) => (
            <li key={location.id} className="ml-4">
              <Link
                href={`/app/family/${selectedFamilyId}/location/${location.id}`}
              >
                {location.name}
              </Link>
            </li>
          ))}
        </>
      )}
      {petMoments.length > 0 && (
        <>
          <li className="font-semibold mt-4">Moments:</li>
          {petMoments.map((moment) => (
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

export default PetTimelineFacts;
