import React, { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Pet, Moment } from "@/db/db_types";
import { FamilyData } from "@/hooks/useFamilyData";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { usePetDataContext } from "@/context/PetDataContext";
import { usePetTimelineContext } from "@/context/PetTimelineContext";
import PetCarousel from "@/components/PetCarousel";
import PetDetails from "@/components/PetDetails2";
import TimelineBars from "@/components/TimelineBars";

const PetInfoPage: React.FC = () => {
  const {
    familyData,
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
      setCurrentMomentIndex(0);
    }
  }, [familyData, petId]);

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
    <div
      className="flex flex-col sm:flex-row gap-4 items-stretch justify-center min-h-screen p-0"
      id="pet-detail-container"
    >
      {/* <PetCarousel
        moments={moments}
        currentMomentIndex={currentMomentIndex}
        setCurrentMomentIndex={setCurrentMomentIndex}
      /> */}
      {/* <PetDetails
        petData={petData}
        moments={moments}
        currentMomentIndex={currentMomentIndex}
        setCurrentMomentIndex={setCurrentMomentIndex}
      /> */}
      <TimelineBars petTimelines={petTimelines} />
    </div>
  );
};

export default PetInfoPage;
