import React from "react";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import DateSpan from "@/components/DateSpan";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { CameraIcon } from "@radix-ui/react-icons";
interface LocationTimelineFactsProps {
  locationId: number | null;
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
    <Card className="w-full h-full overflow-y-auto">
      <CardContent className="">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="location-info">
            <AccordionTrigger className="text-xl font-bold">
              {location.name}
            </AccordionTrigger>
            <AccordionContent>
              <DateSpan
                start_date={location.start_date}
                end_date={location.end_date}
              />
            </AccordionContent>
          </AccordionItem>
          {locationMoments.length > 0 && (
            <>
              {locationMoments.map((moment) => (
                <AccordionItem key={moment.id} value={moment.id.toString()}>
                  <AccordionTrigger>
                    <div className="flex justify-between items-center w-full ml-2">
                      <div
                        className="cursor-pointer hover:underline"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent accordion from toggling
                          onMomentClick(moment.id);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                          {moment.title}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <DateSpan
                      start_date={moment.start_date}
                      end_date={moment.end_date}
                    />
                    <MoreLink url={`moment/${moment.id}`} />
                  </AccordionContent>
                </AccordionItem>
              ))}
              {overlappingPets.length > 0 && (
                <>
                  {overlappingPets.map((pet) => (
                    <AccordionItem key={pet.id} value={pet.id.toString()}>
                      <AccordionTrigger>{pet.name}</AccordionTrigger>
                      <AccordionContent>
                        <DateSpan
                          start_date={pet.start_date}
                          end_date={pet.end_date}
                        />
                        <MoreLink url={`pet/${pet.id}`} />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </>
              )}
            </>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default LocationTimelineFacts;
