import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { usePets } from "@/hooks/usePets";
import PetForm from "@/components/pet/PetForm";

const PetFormPage = () => {
  const navigate = useNavigate();
  const { petId: petIdParam, familyId: familyIdParam } = useParams<{
    petId?: string;
    familyId?: string;
  }>();
  
  const [currentFamilyId, setCurrentFamilyId] = useState(
    familyIdParam ? parseInt(familyIdParam, 10) : 0
  );
  const petId = petIdParam ? parseInt(petIdParam, 10) : undefined;
  const { familyData, isLoading, error } = useFamilyDataContext();
  const { createPet, updatePet, deletePet } = usePets();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading family data: {error.message}</div>;

  const pet = petId
    ? familyData?.pets.find((p) => p.id === petId)
    : undefined;

  const handleFamilyChange = (newFamilyId: number) => {
    setCurrentFamilyId(newFamilyId);
  };

  const handleDelete = async () => {
    if (!petId) return;
    try {
      await deletePet(petId);
      navigate(`/app/family/${currentFamilyId}`);
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  };

  const handleSubmit = async (values: {
    name: string;
    start_date: Date | null;
    end_date: Date | null;
  }) => {
    const petData = {
      name: values.name,
      start_date: values.start_date || undefined,
      end_date: values.end_date || undefined,
      family_id: currentFamilyId,
    };

    try {
      if (petId) {
        await updatePet({ ...petData, id: petId });
      } else {
        const newPet = await createPet(petData);
        console.log('Created new pet:', newPet);
      }
      navigate(`/app/family/${currentFamilyId}`);
    } catch (error) {
      console.error("Error saving pet:", error);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <PetForm
      petId={petId}
      familyId={currentFamilyId}
      onFamilyChange={handleFamilyChange}
      initialData={pet}
      onDelete={handleDelete}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

export default PetFormPage;
