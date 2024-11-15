import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import PetForm from "@/components/PetForm";
import { supabaseClient } from "@/db/supabaseClient";

const PetFormPage = () => {
  const { petId: petIdParam, familyId: familyIdParam } = useParams<{
    petId?: string;
    familyId?: string;
  }>();
  const navigate = useNavigate();
  const petId = petIdParam ? parseInt(petIdParam, 10) : undefined;
  const familyId = familyIdParam ? parseInt(familyIdParam, 10) : 0;

  const { familyData, isLoading, error } = useFamilyDataContext();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading family data: {error.message}</div>;

  const pet = petId
    ? familyData?.pets.find((p) => p.id === petId)
    : undefined;

  const handleDelete = async () => {
    if (!petId) return;

    const { error } = await supabaseClient
      .from("pets")
      .delete()
      .eq("id", petId);

    if (error) {
      console.error("Error deleting pet:", error);
      return;
    }

    navigate(`/app/family/${familyId}`);
  };

  const handleSubmit = async (values: {
    name: string;
    start_date: Date | null;
    end_date: Date | null;
  }) => {
    const petData = {
      name: values.name,
      start_date: values.start_date?.toISOString().split("T")[0],
      end_date: values.end_date?.toISOString().split("T")[0],
      family_id: familyId,
    };

    if (petId) {
      // Update existing pet
      const { error } = await supabaseClient
        .from("pets")
        .update(petData)
        .eq("id", petId);

      if (error) {
        console.error("Error updating pet:", error);
        return;
      }
    } else {
      // Create new pet
      const { error } = await supabaseClient.from("pets").insert([petData]);

      if (error) {
        console.error("Error creating pet:", error);
        return;
      }
    }

    navigate(`/app/family/${familyId}`);
  };

  return (
    <PetForm
      petId={petId}
      familyId={familyId}
      initialData={pet}
      onDelete={handleDelete}
      onSubmit={handleSubmit}
    />
  );
};

export default PetFormPage;
