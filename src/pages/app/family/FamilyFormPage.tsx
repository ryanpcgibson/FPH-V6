import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import FamilyForm from "@/components/family/FamilyForm";
import { useFamilies } from "@/hooks/useFamilies";
import type { FamilyInsert } from "@/db/db_types";

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

  const handleSubmit = async (values: FamilyInsert) => {
    try {
      if (familyId) {
        await updateFamily({ ...values, id: familyId });
        navigate(`/app/family/${familyId}`);
      } else {
        const newFamily = await createFamily(values);
        navigate(`/app/family/${newFamily.id}`);
      }
    } catch (error) {
      console.error("Error saving family:", error);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <FamilyForm
      familyId={familyId}
      initialData={
        familyData && family?.name ? { name: family.name } : undefined
      }
      onDelete={handleDelete}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

export default FamilyFormPage;
