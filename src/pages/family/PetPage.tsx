import React, { useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Pet } from "../../db/db_types";
import ImageCarousel from "../../components/ImageCarousel";
import { useFamilyDataContext } from "../../context/FamilyDataContext";

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
    <div>
      <Card className="w-full h-[calc(100vh-4rem)]">
        <CardContent className="h-[calc(100%-4rem)]">
          <ImageCarousel photo={photo} />
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
  );
};

export default PetPage;
