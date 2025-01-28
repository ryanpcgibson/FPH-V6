import React from "react";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import DateSpan from "@/components/DateSpan";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import CompoundListItem from "@/components/CompoundListItem";
import { useNavigate } from "react-router-dom";
import { useMoments } from "@/hooks/useMoments";
import { Pencil1Icon } from "@radix-ui/react-icons";

interface LocationTimelineFactsProps {
  locationId: number | null;
  onMomentClick: (momentId: number) => void;
}

const LocationTimelineFacts: React.FC<LocationTimelineFactsProps> = ({
  locationId,
  onMomentClick,
}) => {
  const { familyData, selectedFamilyId } = useFamilyDataContext();
  const navigate = useNavigate();
  const { disconnectMoment } = useMoments();

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
    <Card className="w-full h-full overflow-y-auto">
      <CardContent className="">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="location-info">
            <AccordionTrigger className="text-xl font-bold">
              {location.name}
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex justify-between items-center w-full">
                <DateSpan
                  start_date={location.start_date}
                  end_date={location.end_date}
                />
                <Pencil1Icon
                  className="cursor-pointer hover:opacity-70"
                  onClick={() =>
                    navigate(
                      `/app/family/${selectedFamilyId}/location/${location.id}/edit`
                    )
                  }
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          {locationMoments.map((moment) => (
            <CompoundListItem
              key={moment.id}
              item={{ ...moment, name: moment.title }}
              itemType="moment"
              customOnClick={() => onMomentClick(moment.id)}
              customOnDisconnect={() =>
                disconnectMoment(moment.id, locationId!, "location")
              }
            />
          ))}
          {overlappingPets.length > 0 && (
            <>
              {overlappingPets.map((pet) => (
                <CompoundListItem key={pet.id} item={pet} itemType="pet" />
              ))}
            </>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default LocationTimelineFacts;
