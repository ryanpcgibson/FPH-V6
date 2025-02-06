import { supabaseClient } from "@/db/supabaseClient";

export const usePhotos = () => {
  const addPhotoToMoment = async (photoId: string, momentId: number) => {
    console.log("Adding photo to moment", photoId, momentId);
    const { error } = await supabaseClient
      .from("moment_photos")
      .insert([{ photo_id: photoId, moment_id: momentId }]);

    if (error) {
      throw new Error(`Failed to add photo to moment: ${error.message}`);
    }
  };

  return { addPhotoToMoment };
};
