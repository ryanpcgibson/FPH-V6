import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import type { FamilyData, Moment } from "@/db/db_types";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { Card, CardContent } from "@/components/ui/card";
import PetCarousel from "@/components/pet/PetCarousel";
import LocationTimelineFacts from "@/components/location/LocationTimelineFacts";

const LocationDetailPage: React.FC = () => {
  const { locationId: locationIdParam } = useParams<{ locationId: string }>();
  const locationId = locationIdParam ? parseInt(locationIdParam, 10) : null;
  const { familyData } = useFamilyDataContext();
  const location = useLocation();
  const navigate = useNavigate();

  const [moments, setMoments] = useState<FamilyData["moments"]>([]);
  const [currentMomentIndex, setCurrentMomentIndex] = useState<number>(0);

  useEffect(() => {
    if (familyData && locationId) {
      const locationMoments = familyData.moments.filter((moment: Moment) =>
        moment.locations?.some(
          (location: { id: number }) => location.id === locationId
        )
      );
      setMoments(locationMoments);

      const queryParams = new URLSearchParams(location.search);
      const momentIdParam = queryParams.get("momentId");

      if (momentIdParam) {
        const momentId = parseInt(momentIdParam, 10);
        const index = locationMoments.findIndex(
          (moment) => moment.id === momentId
        );
        if (index !== -1) {
          setCurrentMomentIndex(index);
        }
      } else if (locationMoments.length === 1) {
        // If there's only one moment, select it by default
        setCurrentMomentIndex(0);
        // Update URL to reflect the selected moment
        navigate(`${location.pathname}?momentId=${locationMoments[0].id}`);
      } else if (locationMoments.length > 0) {
        // Set first moment as default if none specified
        setCurrentMomentIndex(0);
      }
    }
  }, [familyData, locationId, location.search, navigate]);

  useEffect(() => {
    if (moments.length > 0) {
      const currentMoment = moments[currentMomentIndex];
      if (currentMoment) {
        const newUrl = `${location.pathname}?momentId=${currentMoment.id}`;
        navigate(newUrl);
      }
    }
  }, [currentMomentIndex, moments, location.pathname, navigate]);

  const handleMomentClick = (momentId: number) => {
    const index = moments.findIndex((moment) => moment.id === momentId);
    if (index !== -1) {
      setCurrentMomentIndex(index);
    }
  };

  return (
    <div
      className="flex flex-row gap-2 h-[calc(100vh-54px)] max-h-[446px] w-full my-[8px]"
      id="page-container"
    >
      <div
        className="flex flex-col flex-grow w-3/5 overflow-hidden h-full"
        id="carousel-container"
      >
        <PetCarousel
          moments={moments}
          currentMomentIndex={currentMomentIndex}
          setCurrentMomentIndex={setCurrentMomentIndex}
        />
      </div>
      <div
        className="flex flex-col flex-grow w-2/5 h-full"
        id="location-detail-container"
      >
        <LocationTimelineFacts
          locationId={locationId}
          onMomentClick={handleMomentClick}
          currentMomentId={moments[currentMomentIndex]?.id}
        />
      </div>
    </div>
  );
};

export default LocationDetailPage;
