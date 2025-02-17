import React from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useMoments } from "@/hooks/useMoments";
import MomentForm from "@/components/moment/MomentForm";
import { useEntityFormPage } from "@/hooks/useEntityFormPage";
import type { Moment } from "@/db/db_types";
import { connectMoment } from "@/services/connectMoment";

interface MomentFormValues {
  title: string;
  body: string;
  start_date: Date | null;
  end_date: Date | null;
  pets?: number[];
  locations?: number[];
}

const MomentFormPage = () => {
  const { momentId: momentIdParam } = useParams<{ momentId?: string }>();
  const [searchParams] = useSearchParams();
  const returnPath = searchParams.get("returnPath");
  const navigate = useNavigate();

  const momentId = momentIdParam ? parseInt(momentIdParam, 10) : undefined;
  const preSelectedLocationId = searchParams.get("locationId")
    ? parseInt(searchParams.get("locationId")!, 10)
    : undefined;

  const { createMoment, updateMoment, deleteMoment } = useMoments();

  const {
    entity: moment,
    handleDelete,
    handleSubmit,
    handleCancel,
  } = useEntityFormPage<Moment, MomentFormValues>({
    entityId: momentId,
    entityType: "moment",
    findEntity: (data, id) => data?.moments.find((m) => m.id === id),
    createEntity: async (data) => {
      const newMoment = await createMoment(data);
      if (preSelectedLocationId) {
        await connectMoment({
          momentId: newMoment.id,
          entityId: preSelectedLocationId,
          entityType: "location",
        });
      }
      return newMoment;
    },
    updateEntity: (data) => updateMoment(data),
    deleteEntity: (id) => deleteMoment(id),
  });

  const handleCancelForm = () => {
    if (returnPath) {
      navigate(decodeURIComponent(returnPath));
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="w-full h-full" id="page-container">
      <MomentForm
        momentId={momentId}
        initialData={moment}
        onDelete={handleDelete}
        onSubmit={handleSubmit}
        onCancel={handleCancelForm}
        preSelectedLocationId={preSelectedLocationId}
      />
    </div>
  );
};

export default MomentFormPage;
