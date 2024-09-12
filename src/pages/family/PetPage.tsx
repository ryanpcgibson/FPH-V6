import React, { useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Pet } from "../../db/db_types";
import ImageCarousel from "../../components/ImageCarousel";
import { useFamilyDataContext } from "../../context/FamilyDataContext";
import { EmblaOptionsType } from "embla-carousel";
import EmblaCarousel from "../../components/ui/EmblaCarousel";

const OPTIONS: EmblaOptionsType = {};
const SLIDE_COUNT = 5;
const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

const PetPage: React.FC = () => {
  const [photo, setPhoto] = useState<string | null>(null);

  const { petId: petIdParam } = useParams<{ petId: string }>();
  const petId = petIdParam ? parseInt(petIdParam, 10) : null;

  const [selectedPetId, setSelectedPetId] = useState<number | null>(petId);
  const [initialData, setInitialData] = useState<Partial<Pet> | undefined>(
    undefined
  );
  const { familyData, isLoading, error } = useFamilyDataContext();

  const handleSelectPet = (petId: number | null) => {
    setSelectedPetId(petId);
    if (petId === null) {
      setInitialData(undefined);
    } else {
      const selectedPet = familyData?.pets.find((pet) => pet.id === petId);
      setInitialData(selectedPet ? { ...selectedPet } : undefined);
    }
  };

  useEffect(() => {
    handleSelectPet(selectedPetId);
  }, [petId, selectedPetId, familyData]);

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
    <div className="chart-wrapper mx-auto flex max-w-6xl flex-col flex-wrap items-start justify-center gap-6 p-6 sm:flex-row sm:p-8">
      <div className="grid w-full gap-6 sm:grid-cols-2 lg:max-w-[22rem] lg:grid-cols-1 xl:max-w-[25rem]">
        <Card className="g:max-w-md">
          <CardContent className="h-[calc(100%-4rem)]">
            {/* <ImageCarousel photo="https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68" /> */}
            <EmblaCarousel slides={SLIDES} options={OPTIONS} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{initialData?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Pet Details</h2>
              <p>Name: </p>
              <p>Species: {initialData?.species}</p>
              <p>Breed: {initialData?.breed}</p>
              {/* Add more pet details here */}
            </div>
            <div className="mt-4">
              <p>Select a pet to view details</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PetPage;
