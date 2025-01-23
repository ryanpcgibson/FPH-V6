import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { FamilyData, Moment } from "@/db/db_types";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { Card, CardContent } from "@/components/ui/card";
import PetCarousel from "@/components/pet/PetCarousel";
import LocationTimelineFacts from "@/components/location/LocationTimelineFacts";

const LocationDetailPage: React.FC = () => {
  const { locationId: locationIdParam } = useParams<{ locationId: string }>();
  const locationId = locationIdParam ? parseInt(locationIdParam, 10) : null;
  const { familyData } = useFamilyDataContext();

  const [moments, setMoments] = useState<FamilyData["moments"]>([]);
  const [currentMomentIndex, setCurrentMomentIndex] = useState<number>(0);

  useEffect(() => {
    if (familyData && locationId) {
      const locationMoments = familyData.moments.filter((moment: Moment) =>
        moment.locations?.some((location) => location.id === locationId)
      );
      setMoments(locationMoments);
    }
  }, [familyData, locationId]);

  const handleMomentClick = (momentId: number) => {
    const index = moments.findIndex((moment) => moment.id === momentId);
    if (index !== -1) {
      setCurrentMomentIndex(index);
    }
  };

  return (
    <div className="flex flex-row gap-2 h-full w-full" id="page-container">
      <div
        className="flex flex-col flex-grow w-3/5 h-full overflow-hidden"
        id="carousel-container"
      >
        <Card className="w-full h-full">
          <CardContent className="h-full p-0">
            <PetCarousel
              moments={moments}
              currentMomentIndex={currentMomentIndex}
              setCurrentMomentIndex={setCurrentMomentIndex}
            />
          </CardContent>
        </Card>
      </div>
      <div
        className="flex flex-row flex-grow w-2/5"
        id="location-detail-container"
      >
        <Card className="w-full bg-blue-400">
          <CardContent className="">
            <LocationTimelineFacts
              locationId={locationId}
              onMomentClick={handleMomentClick}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LocationDetailPage;
