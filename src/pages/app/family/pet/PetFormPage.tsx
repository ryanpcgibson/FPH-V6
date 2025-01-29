import React from "react";
import { useParams } from "react-router-dom";
import { usePets } from "@/hooks/usePets";
import PetForm from "@/components/pet/PetForm";
import { useEntityFormPage } from "@/hooks/useEntityFormPage";
import type { Pet } from "@/db/db_types";

interface PetFormValues {
  name: string;
  start_date: Date | null;
  end_date: Date | null;
}

const PetFormPage = () => {
  const { petId: petIdParam, familyId: familyIdParam } = useParams<{
    petId?: string;
    familyId?: string;
  }>();

  const petId = petIdParam ? parseInt(petIdParam, 10) : undefined;
  const { createPet, updatePet, deletePet } = usePets();

  const {
    currentFamilyId,
    entity: pet,
    isLoading,
    error,
    handleFamilyChange,
    handleDelete,
    handleSubmit,
    handleCancel,
  } = useEntityFormPage<Pet, PetFormValues>({
    entityId: petId,
    familyId: familyIdParam ? parseInt(familyIdParam, 10) : undefined,
    entityType: "pet",
    findEntity: (data, id) => data?.pets.find((p) => p.id === id),
    createEntity: createPet,
    updateEntity: updatePet,
    deleteEntity: deletePet,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading family data: {error.message}</div>;

  return (
    <div className="mt-2" id="pet-form-page">
      <PetForm
        petId={petId}
        familyId={currentFamilyId}
        onFamilyChange={handleFamilyChange}
        initialData={pet}
        onDelete={handleDelete}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default PetFormPage;
