import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseClient } from "@/db/supabaseClient";
import { PetInsert, PetUpdate } from "@/db/db_types";
import { prepareEntityForDB } from "@/utils/dbUtils";

export function usePets() {
  const queryClient = useQueryClient();

  const createPetMutation = useMutation({
    mutationFn: async (petData: PetInsert) => {
      const preparedData = prepareEntityForDB(petData);
      const { error } = await supabaseClient
        .from("pets")
        .insert([preparedData]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["familyData"] });
    },
  });

  const updatePetMutation = useMutation({
    mutationFn: async (petData: PetUpdate) => {
      if (!petData.id) throw new Error("Pet ID is required");

      const preparedData = prepareEntityForDB(petData);
      const { error } = await supabaseClient
        .from("pets")
        .update(preparedData)
        .eq("id", petData.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["familyData"] });
    },
  });

  const deletePetMutation = useMutation({
    mutationFn: async (petId: number) => {
      const { error } = await supabaseClient
        .from("pets")
        .delete()
        .eq("id", petId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["familyData"] });
    },
  });

  return {
    createPet: createPetMutation.mutate,
    updatePet: updatePetMutation.mutate,
    deletePet: deletePetMutation.mutate,
    isLoading:
      createPetMutation.isPending ||
      updatePetMutation.isPending ||
      deletePetMutation.isPending,
    error:
      createPetMutation.error ||
      updatePetMutation.error ||
      deletePetMutation.error,
  };
}
