import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import FamilyForm from "@/components/family/FamilyForm";
import { useFamilies } from "@/hooks/useFamilies";

const FamilyFormPage = () => {
  const { familyId: familyIdParam } = useParams<{ familyId?: string }>();
  const familyId = familyIdParam ? parseInt(familyIdParam, 10) : undefined;
  const navigate = useNavigate();
  const { families = [], familyData } = useFamilyDataContext();
  const family = familyId ? families.find((f) => f.id === familyId) : undefined;
  const { deleteFamily, updateFamily, createFamily } = useFamilies();

  const handleDelete = async () => {
    if (!familyId) return;
    try {
      await deleteFamily(familyId);
      navigate("/app/families");
    } catch (error) {
      console.error("Error deleting family:", error);
    }
  };

  const handleSubmit = async (values: { name: string }) => {
    try {
      if (familyId) {
        await updateFamily(values);
      } else {
        await createFamily(values);
      }
      navigate(`/app/family/${familyId}`);
    } catch (error) {
      console.error("Error saving family:", error);
    }
  };

  return (
    <FamilyForm
      familyId={familyId}
      initialData={
        familyData && family?.name ? { name: family.name } : undefined
      }
      onDelete={handleDelete}
      onSubmit={handleSubmit}
    />
  );
};

export default FamilyFormPage;
