import React from "react";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import DateSpan from "@/components/DateSpan";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CompoundListItem from "@/components/CompoundListItem";
import { useNavigate } from "react-router-dom";
import { useMoments } from "@/hooks/useMoments";
import { Pencil1Icon } from "@radix-ui/react-icons";

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
  const navigate = useNavigate();
  const { disconnectMoment } = useMoments();

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
    <Card className="w-full h-full overflow-y-auto">
      <CardContent className="">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="pet-info">
            <AccordionTrigger className="text-xl font-bold">
              {pet.name}
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex justify-between items-center w-full">
                <DateSpan start_date={pet.start_date} end_date={pet.end_date} />
                <Pencil1Icon
                  className="cursor-pointer hover:opacity-70"
                  onClick={() =>
                    navigate(
                      `/app/family/${selectedFamilyId}/pet/${pet.id}/edit`
                    )
                  }
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          {petMoments.map((moment) => {
            return (
              <CompoundListItem
                key={moment.id}
                item={{ ...moment, name: moment.title }}
                itemType="moment"
                customOnClick={() => onMomentClick(moment.id)}
                customOnDisconnect={() =>
                  disconnectMoment(moment.id, petId!, "pet")
                }
                isSelected={currentMomentId === moment.id}
              />
            );
          })}
          {overlappingLocations.length > 0 && (
            <>
              {overlappingLocations.map((location) => (
                <CompoundListItem
                  key={location.id}
                  item={location}
                  itemType="location"
                />
              ))}
            </>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default PetTimelineFacts;
