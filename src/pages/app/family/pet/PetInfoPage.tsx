import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Pet, Moment } from "@/db/db_types";
import { FamilyData } from "@/hooks/useFamilyData";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { usePetDataContext } from "@/context/PetDataContext";
import { usePetTimelineContext } from "@/context/PetTimelineContext";
import PetCarousel from "@/components/PetCarousel";
import TimelineBars from "@/components/TimelineBars";
import Header from "@/components/Header";

const PetInfoPage: React.FC = () => {
  const location = useLocation();
  const momentId = location.state?.momentId;

  const {
    familyData,
    familyId,
    isLoading: isFamilyLoading,
    error: familyError,
  } = useFamilyDataContext();
  const {
    petData,
    petId,
    isLoading: isPetLoading,
    error: petError,
  } = usePetDataContext();
  const {
    petTimelines,
    isLoading: isPetTimelineLoading,
    error: petTimelineError,
  } = usePetTimelineContext();

  const isLoading = isFamilyLoading || isPetLoading || isPetTimelineLoading;
  const error = familyError || petError || petTimelineError;

  const [moments, setMoments] = useState<FamilyData["moments"]>([]);
  const [currentMomentIndex, setCurrentMomentIndex] = useState<number>(0);

  useEffect(() => {
    if (familyData && petId) {
      const petMoments = familyData.moments.filter((moment: Moment) =>
        moment.pets.some((pet: { id: number }) => pet.id === petId)
      );
      setMoments(petMoments);

      if (momentId) {
        const index = petMoments.findIndex((moment) => moment.id === momentId);
        setCurrentMomentIndex(index !== -1 ? index : 0);
      } else {
        setCurrentMomentIndex(0);
      }
    }
  }, [familyData, petId, momentId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading ...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-row h-screen" id="page-container">
      <div className="w-3/5 h-full" id="carousel-container">
        <PetCarousel
          moments={moments}
          currentMomentIndex={currentMomentIndex}
          setCurrentMomentIndex={setCurrentMomentIndex}
        />
      </div>
      <div className="flex flex-col flex-grow w-2/5" id="pet-detail-container">
        <TimelineBars petTimelines={petTimelines} petId={petId} />
      </div>
    </div>
  );
};

export default PetInfoPage;
