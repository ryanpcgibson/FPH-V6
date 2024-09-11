// src/pages/PetPage.tsx

import React, { useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PetForm from "../components/PetForm";
import PetDropdown from "../components/PetDropdown";
import { useFamilyData } from "../hooks/useFamilyData";
import { Pet } from "../db/db_types";

const PetPage: React.FC = () => {
  const { familyId } = useOutletContext<{ familyId: number | null }>();
  const { petId: petIdParam } = useParams<{ petId: string }>();
  const petId = petIdParam ? parseInt(petIdParam, 10) : null;

  const [selectedPetId, setSelectedPetId] = useState<number | null>(petId);
  const [initialData, setInitialData] = useState<Partial<Pet> | undefined>(
    undefined
  );

  // TODO should this be in a hook somewhere?
  const { data, error, isLoading } = useFamilyData(familyId);

  const handleSelectPet = (petId: number | null) => {
    setSelectedPetId(petId);
    if (petId === null) {
      setInitialData(undefined); // Clear form fields
    } else {
      const selectedPet = data?.pets.find((pet) => pet.id === petId);
      setInitialData(selectedPet ? { ...selectedPet } : undefined); // Fill form with selected pet's values
    }
  };

  useEffect(() => {
    handleSelectPet(selectedPetId);
    console.log("PetPage selectedPetId", selectedPetId);
  }, [petId, selectedPetId, data]);

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
    <Card>
      <CardHeader>
        <CardTitle>Pet Information</CardTitle>
      </CardHeader>
      <CardContent>
        <PetDropdown
          selectedPetId={selectedPetId}
          onSelectPet={handleSelectPet}
          pets={data?.pets || []}
        />
        <PetForm
          familyId={familyId}
          petId={selectedPetId}
          initialData={initialData}
        />
      </CardContent>
    </Card>
  );
};

export default PetPage;
