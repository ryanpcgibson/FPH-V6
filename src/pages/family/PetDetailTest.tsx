import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Pet, Photo, FamilyData } from "../../db/db_types";
import { useFamilyDataContext } from "../../context/FamilyDataContext";
import EmblaCarousel from "../../components/ui/EmblaCarousel";
import PetDetails from "../../components/PetDetails";

const PetPage: React.FC = () => {
  const { petId: petIdParam } = useParams<{ petId: string }>();
  const petId = petIdParam ? parseInt(petIdParam, 10) : null;

  const [petData, setPetData] = useState<Pet | undefined>(undefined);

  const { familyData, isLoading, error } = useFamilyDataContext();
  const [moments, setMoments] = useState<FamilyData["moments"]>([]);
  const [currentMomentIndex, setCurrentMomentIndex] = useState<number>(0);
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    if (familyData && petData) {
      console.log("Updating photos", moments[currentMomentIndex].title);
      setPhotos(moments.flatMap((moment) => moment.photos));
    }
  }, [petData, familyData, currentMomentIndex]);

  useEffect(() => {
    if (familyData && petId) {
      setPetData(familyData.pets.find((pet) => pet.id === petId));
      const petMoments = familyData.moments.filter((moment) =>
        moment.pets.some((pet) => pet.id === petId)
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
    <div className="flex flex-col sm:flex-row items-center justify-center min-h-screen p-4 gap-4">
      <div className="w-full sm:w-1/2 max-w-[1000px] flex-grow h-[calc(100vh-2rem)] sm:max-h-[600px]">
        <Card className="h-full overflow-auto rounded-lg">
          <CardHeader>
            <CardTitle>{petData?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <PetDetails
              pet={petData}
              moments={moments}
              currentMomentIndex={currentMomentIndex}
              setCurrentMomentIndex={setCurrentMomentIndex}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PetPage;
