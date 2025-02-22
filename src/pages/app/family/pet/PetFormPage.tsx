import { useParams } from "react-router-dom";
import { usePets } from "@/hooks/usePets";
import { useEntityFormPage } from "@/hooks/useEntityFormPage";
import PetForm from "@/components/pet/PetForm";
import type { Pet } from "@/db/db_types";
import { convertEntityFromDB } from "@/utils/dbUtils";
import { PetFormValues } from "@/components/pet/PetForm";

const PetFormPage = () => {
  const { petId: petIdParam, familyId: familyIdParam } = useParams<{
    petId?: string;
    familyId?: string;
  }>();

  const petId = petIdParam ? parseInt(petIdParam, 10) : undefined;
  const {
    createPet: createPetMutation,
    updatePet: updatePetMutation,
    deletePet,
  } = usePets();

  const createPet = async (data: PetFormValues): Promise<Pet> => {
    if (!data.start_date) throw new Error("Start date is required");
    const dbResponse = await createPetMutation({
      ...data,
      start_date: data.start_date,
      end_date: data.end_date || undefined,
      family_id: currentFamilyId,
    });
    return convertEntityFromDB(dbResponse) as Pet;
  };

  const updatePet = async (
    data: PetFormValues & { id: number }
  ): Promise<Pet> => {
    if (!data.start_date) throw new Error("Start date is required");
    const dbResponse = await updatePetMutation({
      ...data,
      start_date: data.start_date,
      end_date: data.end_date || undefined,
    });
    return convertEntityFromDB(dbResponse) as Pet;
  };

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
    findEntity: (data, id) => data?.pets.find((p: Pet) => p.id === id),
    createEntity: createPet,
    updateEntity: updatePet,
    deleteEntity: deletePet,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading family data: {error.message}</div>;

  return (
    <div className="w-full h-full" id="page-container">
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
