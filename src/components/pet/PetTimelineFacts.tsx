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

interface PetTimelineFactsProps {
  petId: number | null;
  onMomentClick: (momentId: number) => void;
}

const MoreLink: React.FC<{ url: string }> = ({ url }) => {
  const { selectedFamilyId } = useFamilyDataContext();
  return (
    <div className="text-right">
      <a href={`/app/family/${selectedFamilyId}/${url}`}>more...</a>
    </div>
  );
};

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
    <Card className="w-full h-full overflow-y-auto">
      <CardContent className="">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="pet-info">
            <AccordionTrigger className="text-xl font-bold">
              {pet.name}
            </AccordionTrigger>
            <AccordionContent>
              <DateSpan start_date={pet.start_date} end_date={pet.end_date} />
            </AccordionContent>
          </AccordionItem>
          {overlappingLocations.length > 0 && (
            <>
              {overlappingLocations.map((location) => (
                <AccordionItem key={location.id} value={location.id.toString()}>
                  <AccordionTrigger>{location.name}</AccordionTrigger>
                  <AccordionContent>
                    <DateSpan
                      start_date={location.start_date}
                      end_date={location.end_date || "current"}
                    />
                    <MoreLink url={`location/${location.id}`} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </>
          )}
          {petMoments.length > 0 && (
            <>
              {petMoments.map((moment) => (
                <AccordionItem key={moment.id} value={moment.id.toString()}>
                  <AccordionTrigger>{moment.title}</AccordionTrigger>
                  <AccordionContent>
                    <DateSpan
                      start_date={moment.start_date}
                      end_date={moment.end_date}
                    />
                    <MoreLink url={`moment/${moment.id}`} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default PetTimelineFacts;
