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
import { CameraIcon, GlobeIcon } from "@radix-ui/react-icons";

interface PetTimelineFactsProps {
  petId: number | null;
  onMomentClick: (momentId: number) => void;
}

const PetTimelineFacts: React.FC<PetTimelineFactsProps> = ({
  petId,
  onMomentClick,
}) => {
  const { familyData, selectedFamilyId } = useFamilyDataContext();
  const navigate = useNavigate();

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
              <DateSpan start_date={pet.start_date} end_date={pet.end_date} />
              <div className="text-right">
                <a href={`/app/family/${selectedFamilyId}/pet/${petId}/edit`}>
                  edit...
                </a>
              </div>
            </AccordionContent>
          </AccordionItem>
          {petMoments.map((moment) => {
            return (
              <CompoundListItem
                id={moment.id}
                title={moment.title}
                start_date={moment.start_date}
                end_date={moment.end_date}
                customOnClick={() => onMomentClick(moment.id)}
                url={`moment/${moment.id}`}
                icon={<CameraIcon />}
              />
            );
          })}
          {overlappingLocations.length > 0 && (
            <>
              {overlappingLocations.map((location) => (
                <CompoundListItem
                  id={location.id}
                  title={location.name}
                  start_date={location.start_date}
                  end_date={location.end_date}
                  customOnClick={() =>
                    navigate(
                      `/app/family/${selectedFamilyId}/location/${location.id}`
                    )
                  }
                  url={`location/${location.id}`}
                  icon={<GlobeIcon />}
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
