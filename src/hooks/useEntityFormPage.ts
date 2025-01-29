import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFamilyDataContext } from "@/context/FamilyDataContext";

interface EntityFormPageConfig<T, V> {
  entityId?: number;
  familyId?: number;
  entityType: string;
  findEntity: (data: any, id: number) => T | undefined;
  createEntity: (data: V) => Promise<any>;
  updateEntity: (data: V & { id: number }) => Promise<any>;
  deleteEntity: (id: number) => Promise<any>;
}

export function useEntityFormPage<T, V>({
  entityId,
  familyId,
  entityType,
  findEntity,
  createEntity,
  updateEntity,
  deleteEntity,
}: EntityFormPageConfig<T, V>) {
  const navigate = useNavigate();
  const [currentFamilyId, setCurrentFamilyId] = useState(
    familyId ? parseInt(String(familyId), 10) : 0
  );
  const { familyData, isLoading, error } = useFamilyDataContext();

  const entity = entityId ? findEntity(familyData, entityId) : undefined;

  const handleFamilyChange = (newFamilyId: number) => {
    setCurrentFamilyId(newFamilyId);
  };

  const handleDelete = async () => {
    if (!entityId) return;
    try {
      await deleteEntity(entityId);
      navigate(`/app/family/${currentFamilyId}`);
    } catch (error) {
      console.error(`Error deleting ${entityType}:`, error);
    }
  };

  const handleSubmit = async (values: V) => {
    const entityData = {
      ...values,
      family_id: currentFamilyId,
    };

    try {
      if (entityId) {
        await updateEntity({ ...entityData, id: entityId });
      } else {
        const newEntity = await createEntity(entityData);
        console.log(`Created new ${entityType}:`, newEntity);
      }
      navigate(`/app/family/${currentFamilyId}`);
    } catch (error) {
      console.error(`Error saving ${entityType}:`, error);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return {
    currentFamilyId,
    entity,
    isLoading,
    error,
    handleFamilyChange,
    handleDelete,
    handleSubmit,
    handleCancel,
  };
}
