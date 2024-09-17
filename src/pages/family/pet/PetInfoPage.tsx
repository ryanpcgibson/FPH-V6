import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Pet, Photo } from "@/db/db_types";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { FamilyData } from "@/hooks/useFamilyData";
import EmblaCarousel from "@/components/ui/EmblaCarousel";
import { formatDateForDisplay } from "@/utils/dateUtils";

const PetDetail: React.FC = () => {
  const { petId: petIdParam } = useParams<{ petId: string }>();
  const petId = petIdParam ? parseInt(petIdParam, 10) : null;

  const [petData, setPetData] = useState<Pet | undefined>(undefined);

  const { familyData, isLoading, error } = useFamilyDataContext();
  const [moments, setMoments] = useState<FamilyData["moments"]>([]);
  const [currentMomentIndex, setCurrentMomentIndex] = useState<number>(0);
  const [photos, setPhotos] = useState<Photo[]>([]);

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

  useEffect(() => {
    if (familyData && petData) {
      setPhotos(moments[currentMomentIndex].photos);
    }
  }, [moments, currentMomentIndex]);

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
      <div className="w-full sm:w-1/2 max-w-[calc(100vh-2rem)] aspect-square sm:max-h-[600px]">
        <Card className="w-full h-full overflow-hidden rounded-lg">
          <CardContent className="h-full p-0">
            <EmblaCarousel photos={photos} />
          </CardContent>
        </Card>
      </div>
      <div className="w-full sm:w-1/2 max-w-[1000px] flex-grow h-[calc(100vh-2rem)] sm:max-h-[600px]">
        <Card className="h-full overflow-auto rounded-lg">
          <CardHeader>
            <CardTitle>{petData?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-4">
              <Select
                value={currentMomentIndex?.toString() ?? ""}
                onValueChange={(value) =>
                  setCurrentMomentIndex(parseInt(value, 10))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a moment" />
                </SelectTrigger>
                <SelectContent>
                  {moments.map((moment, index) => (
                    <SelectItem key={moment.id} value={index.toString()}>
                      {moment.title} {formatDateForDisplay(moment.start_date)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PetDetail;
