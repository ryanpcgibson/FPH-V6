import { useParams } from "react-router-dom";
import PetForm from "@/components/pet/PetForm";
import { useEntityFormPage } from "@/hooks/useEntityFormPage";
import type { Pet } from "@/db/db_types";
import { usePets } from "@/hooks/usePets";
import { PetFormValues } from "@/components/pet/PetForm";

const PetFormPage = () => {
  // TODO: make context
  const { petId: petIdParam } = useParams<{
    petId?: string;
  }>();
  const petId = petIdParam ? parseInt(petIdParam, 10) : undefined;

  const { createPet, updatePet, deletePet } = usePets();

  const {
    entity: pet,
    handleDelete,
    handleSubmit,
    handleCancel,
  } = useEntityFormPage<Pet, PetFormValues>({
    entityId: petId,
    entityType: "pet",
    findEntity: (data, id) => data?.pets.find((p: Pet) => p.id === id),
    createEntity: (data) => createPet(data),
    updateEntity: (data) => updatePet(data),
    deleteEntity: (id) => deletePet(id),
  });

  return (
    <div className="w-full h-full" id="page-container">
      <PetForm
        petId={petId}
        initialData={pet}
        onDelete={handleDelete}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default PetFormPage;
