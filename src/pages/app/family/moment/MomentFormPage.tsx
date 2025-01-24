import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { useMoments } from "@/hooks/useMoments";
import MomentForm from "@/components/moment/MomentForm";

const MomentFormPage = () => {
  const navigate = useNavigate();
  const { momentId: momentIdParam, familyId: familyIdParam } = useParams<{
    momentId?: string;
    familyId?: string;
  }>();

  const [currentFamilyId, setCurrentFamilyId] = useState(
    familyIdParam ? parseInt(familyIdParam, 10) : 0
  );
  const momentId = momentIdParam ? parseInt(momentIdParam, 10) : undefined;
  const { familyData, isLoading, error } = useFamilyDataContext();
  const { createMoment, updateMoment, deleteMoment } = useMoments();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading family data: {error.message}</div>;

  const moment = momentId
    ? familyData?.moments.find((m) => m.id === momentId)
    : undefined;

  const handleFamilyChange = (newFamilyId: number) => {
    setCurrentFamilyId(newFamilyId);
  };

  const handleDelete = async () => {
    if (!momentId) return;
    try {
      await deleteMoment(momentId);
      navigate(`/app/family/${currentFamilyId}`);
    } catch (error) {
      console.error("Error deleting moment:", error);
    }
  };

  const handleSubmit = async (values: {
    title: string;
    description: string;
    start_date: Date | null;
    end_date: Date | null;
  }) => {
    const momentData = {
      title: values.title,
      description: values.description,
      start_date: values.start_date || undefined,
      end_date: values.end_date || undefined,
      family_id: currentFamilyId,
    };

    try {
      if (momentId) {
        await updateMoment({ ...momentData, id: momentId });
      } else {
        const newMoment = await createMoment(momentData);
        console.log("Created new moment:", newMoment);
      }
      navigate(`/app/family/${currentFamilyId}`);
    } catch (error) {
      console.error("Error saving moment:", error);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <MomentForm
      momentId={momentId}
      familyId={currentFamilyId}
      onFamilyChange={handleFamilyChange}
      initialData={moment}
      onDelete={handleDelete}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

export default MomentFormPage;
