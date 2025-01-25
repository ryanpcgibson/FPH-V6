import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseClient } from "@/db/supabaseClient";
import { PetInsert, PetUpdate } from "@/db/db_types";
import { prepareEntityForDB } from "@/utils/dbUtils";

export function usePets() {
  const queryClient = useQueryClient();

  const createPetMutation = useMutation({
    mutationFn: async (petData: PetInsert) => {
      const preparedData = prepareEntityForDB(petData);
      const { data, error } = await supabaseClient
        .from("pets")
        .insert([preparedData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["familyData"] });
    },
  });

  const updatePetMutation = useMutation({
    mutationFn: async (petData: PetUpdate) => {
      if (!petData.id) throw new Error("Pet ID is required");

      const preparedData = prepareEntityForDB(petData);
      console.log("preparedData", preparedData);
      const { data, error } = await supabaseClient
        .from("pets")
        .update(preparedData)
        .eq("id", petData.id)
        .select()
        .single();

      if (error) throw error;
      return data;
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
    createPet: createPetMutation.mutateAsync,
    updatePet: updatePetMutation.mutateAsync,
    deletePet: deletePetMutation.mutateAsync,
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
