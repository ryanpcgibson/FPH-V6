import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseClient } from "@/db/supabaseClient";
import { prepareEntityForDB } from "@/utils/dbUtils";
import type { LocationInsert, LocationUpdate } from "@/db/db_types";

export function useLocations() {
  const queryClient = useQueryClient();

  const createLocationMutation = useMutation({
    mutationFn: async (location: LocationInsert) => {
      const { data, error } = await supabaseClient
        .from("locations")
        .insert(prepareEntityForDB(location))
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["familyData"] });
    },
  });

  const updateLocationMutation = useMutation({
    mutationFn: async (location: LocationUpdate) => {
      console.log("updateLocationMutation", location);
      if (!location.id) throw new Error("Location ID is required for update");
      const { data, error } = await supabaseClient
        .from("locations")
        .update(prepareEntityForDB(location))
        .eq("id", location.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["familyData"] });
    },
  });

  const deleteLocationMutation = useMutation({
    mutationFn: async (locationId: number) => {
      const { error } = await supabaseClient
        .from("locations")
        .delete()
        .eq("id", locationId);

      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["familyData"] });
    },
  });

  return {
    createLocation: createLocationMutation.mutateAsync,
    updateLocation: updateLocationMutation.mutateAsync,
    deleteLocation: deleteLocationMutation.mutateAsync,
    isLoading:
      createLocationMutation.isPending ||
      updateLocationMutation.isPending ||
      deleteLocationMutation.isPending,
    error:
      createLocationMutation.error ||
      updateLocationMutation.error ||
      deleteLocationMutation.error,
  };
}
