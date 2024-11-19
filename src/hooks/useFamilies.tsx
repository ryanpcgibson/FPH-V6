import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseClient } from "@/db/supabaseClient";
import { FamilyInsert, FamilyUpdate } from "@/db/db_types";
import { prepareEntityForDB } from "@/utils/dbUtils";

export function useFamilies() {
  const queryClient = useQueryClient();

  const createFamilyMutation = useMutation({
    mutationFn: async (familyData: FamilyInsert) => {
      const preparedData = prepareEntityForDB(familyData);
      const { error } = await supabaseClient
        .from("families")
        .insert([preparedData]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["families"] });
    },
  });

  const updateFamilyMutation = useMutation({
    mutationFn: async (familyData: FamilyUpdate) => {
      if (!familyData.id) throw new Error("Family ID is required");
      const preparedData = prepareEntityForDB(familyData);
      const { error } = await supabaseClient
        .from("families")
        .update(preparedData)
        .eq("id", familyData.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["families"] });
    },
  });

  const deleteFamilyMutation = useMutation({
    mutationFn: async (familyId: number) => {
      const { error } = await supabaseClient
        .from("families")
        .delete()
        .eq("id", familyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["families"] });
    },
  });

  return {
    createFamily: createFamilyMutation.mutate,
    updateFamily: updateFamilyMutation.mutate,
    deleteFamily: deleteFamilyMutation.mutate,
    isLoading:
      createFamilyMutation.isPending ||
      updateFamilyMutation.isPending ||
      deleteFamilyMutation.isPending,
    error:
      createFamilyMutation.error ||
      updateFamilyMutation.error ||
      deleteFamilyMutation.error,
  };
}
