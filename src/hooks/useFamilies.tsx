import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseClient } from "@/db/supabaseClient";
import { FamilyInsert, FamilyUpdate } from "@/db/db_types";

export function useFamilies() {
  const queryClient = useQueryClient();

  const createFamilyMutation = useMutation({
    mutationFn: async (familyData: FamilyInsert) => {
      const { data, error } = await supabaseClient
        .from("families")
        .insert([familyData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["families"] });
    },
  });

  const updateFamilyMutation = useMutation({
    mutationFn: async (familyData: FamilyUpdate) => {
      if (!familyData.id) throw new Error("Family ID is required");
      const { data, error } = await supabaseClient
        .from("families")
        .update(familyData)
        .eq("id", familyData.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["families"] });
      queryClient.invalidateQueries({ queryKey: ["familyData"] });
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
    createFamily: createFamilyMutation.mutateAsync,
    updateFamily: updateFamilyMutation.mutateAsync,
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
