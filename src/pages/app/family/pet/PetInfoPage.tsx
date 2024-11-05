import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { Moment } from "@/db/db_types";
import { FamilyData } from "@/hooks/useFamilyData";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { usePetTimelineContext } from "@/context/PetTimelineContext";
import PetCarousel from "@/components/PetCarousel";
import TimelineBars from "@/components/TimelineBars";

const PetInfoPage: React.FC = () => {
  const momentId = 0;
  const { petId: petIdParam } = useParams<{ petId: string }>();
  const petId = petIdParam ? parseInt(petIdParam, 10) : null;

  const { familyData } = useFamilyDataContext();
  const { petTimelines } = usePetTimelineContext();

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

  return (
    <div className="flex flex-row h-screen" id="page-container">
      <div className="flex flex-col flex-grow w-3/5" id="carousel-container">
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
