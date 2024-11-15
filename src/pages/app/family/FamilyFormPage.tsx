import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import FamilyForm from "@/components/FamilyForm";
import { supabaseClient } from "@/db/supabaseClient";

const FamilyFormPage = () => {
  const { familyId: familyIdParam } = useParams<{ familyId?: string }>();
  const familyId = familyIdParam ? parseInt(familyIdParam, 10) : undefined;
  const navigate = useNavigate();
  const { familyData } = useFamilyDataContext();

  const handleDelete = async () => {
    if (!familyId) return;

    const { error } = await supabaseClient
      .from("families")
      .delete()
      .eq("id", familyId);

    if (error) {
      console.error("Error deleting family:", error);
      return;
    }

    navigate("/app/families");
  };

  const handleSubmit = async (values: { name: string }) => {
    if (familyId) {
      // Update existing family
      const { error } = await supabaseClient
        .from("families")
        .update({ name: values.name })
        .eq("id", familyId);

      if (error) {
        console.error("Error updating family:", error);
        return;
      }
    } else {
      // Create new family
      const { error } = await supabaseClient
        .from("families")
        .insert([{ name: values.name }]);

      if (error) {
        console.error("Error creating family:", error);
        return;
      }
    }

    navigate("/app/families");
  };

  return (
    <FamilyForm
      familyId={familyId}
      initialData={familyData ? { name: familyData.family_name } : undefined}
      onDelete={handleDelete}
      onSubmit={handleSubmit}
    />
  );
};

export default FamilyFormPage;
