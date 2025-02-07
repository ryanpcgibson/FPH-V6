import React from "react";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useMoments } from "@/hooks/useMoments";
import { Pencil1Icon, LinkBreak1Icon } from "@radix-ui/react-icons";
import DetailListItem, {
  createEditItem,
  createDisconnectItem,
} from "@/components/DetailListItem";
import EntityLink from "@/components/EntityLink";

interface PetTimelineFactsProps {
  petId: number | null;
  onMomentClick: (momentId: number) => void;
  currentMomentId?: number;
}

const PetTimelineFacts: React.FC<PetTimelineFactsProps> = ({
  petId,
  onMomentClick,
  currentMomentId,
}) => {
  const { familyData, selectedFamilyId } = useFamilyDataContext();
  const { disconnectMoment } = useMoments();
  const navigate = useNavigate();

  if (!petId || !familyData) return null;

  const pet = familyData.pets.find((p) => p.id === petId);
  if (!pet) return null;

  const overlappingLocations =
    familyData.overlappingLocationsForPets[petId] || [];
  const petMoments = familyData.moments.filter((moment) =>
    moment.pets?.some((p) => p.id === petId)
  );

  return (
    <Card className="w-full h-full p-0 overflow-y-auto">
      <CardContent className="h-full p-2">
        <DetailListItem
          startDate={pet.start_date}
          endDate={pet.end_date}
          dropdownItems={[
            createEditItem(`pet/${pet.id}/edit`, () =>
              navigate(`/app/family/${selectedFamilyId}/pet/${pet.id}/edit`)
            ),
          ]}
        >
          <span className="text-xl font-bold text-primary-foreground">
            {pet.name}
          </span>
        </DetailListItem>

        {petMoments.map((moment) => (
          <DetailListItem
            key={moment.id}
            startDate={moment.start_date}
            endDate={moment.end_date}
            dropdownItems={[
              createEditItem(`moment/${moment.id}/edit`, () =>
                navigate(
                  `/app/family/${selectedFamilyId}/moment/${moment.id}/edit`
                )
              ),
              createDisconnectItem(() =>
                disconnectMoment(moment.id, petId!, "pet")
              ),
            ]}
          >
            <EntityLink
              item={{ ...moment, name: moment.title }}
              itemType="moment"
              customOnClick={() => onMomentClick(moment.id)}
              isSelected={currentMomentId === moment.id}
            />
          </DetailListItem>
        ))}

        {overlappingLocations.map((location) => (
          <DetailListItem
            key={location.id}
            startDate={location.start_date}
            endDate={location.end_date}
            dropdownItems={[
              createEditItem(`location/${location.id}/edit`, () =>
                navigate(
                  `/app/family/${selectedFamilyId}/location/${location.id}/edit`
                )
              ),
            ]}
          >
            <EntityLink item={location} itemType="location" />
          </DetailListItem>
        ))}
      </CardContent>
    </Card>
  );
};

export default PetTimelineFacts;
