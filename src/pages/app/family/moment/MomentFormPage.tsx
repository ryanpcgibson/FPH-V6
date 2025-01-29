import React from "react";
import { useParams } from "react-router-dom";
import { useMoments } from "@/hooks/useMoments";
import MomentForm from "@/components/moment/MomentForm";
import { useEntityFormPage } from "@/hooks/useEntityFormPage";
import type { Moment } from "@/db/db_types";

interface MomentFormValues {
  title: string;
  body: string;
  start_date: Date | null;
  end_date: Date | null;
  pets?: number[];
  locations?: number[];
}

const MomentFormPage = () => {
  const { momentId: momentIdParam, familyId: familyIdParam } = useParams<{
    momentId?: string;
    familyId?: string;
  }>();

  const momentId = momentIdParam ? parseInt(momentIdParam, 10) : undefined;
  const { createMoment, updateMoment, deleteMoment } = useMoments();

  const {
    currentFamilyId,
    entity: moment,
    isLoading,
    error,
    handleFamilyChange,
    handleDelete,
    handleSubmit,
    handleCancel,
  } = useEntityFormPage<Moment, MomentFormValues>({
    entityId: momentId,
    familyId: familyIdParam ? parseInt(familyIdParam, 10) : undefined,
    entityType: "moment",
    findEntity: (data, id) => data?.moments.find((m) => m.id === id),
    createMoment,
    updateMoment,
    deleteMoment,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading family data: {error.message}</div>;

  return (
    <div className="mt-2" id="moment-form-page">
      <MomentForm
        momentId={momentId}
        familyId={currentFamilyId}
        onFamilyChange={handleFamilyChange}
        initialData={moment}
        onDelete={handleDelete}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default MomentFormPage;
