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

/**
 * A custom hook that provides reusable form handling logic for entity (pets, locations, etc.) creation and editing pages.
 *
 * This hook encapsulates common functionality needed across different entity forms including:
 * - Family selection handling
 * - Entity creation/updating/deletion
 * - Navigation after form actions
 * - Loading and error states
 *
 * @template T - The type of the entity being managed (e.g., Pet, Location)
 * @template V - The type of form values used for creating/updating the entity
 */

export function useEntityFormPage<T, V>({
  entityId,
  entityType,
  findEntity,
  createEntity,
  updateEntity,
  deleteEntity,
}: EntityFormPageConfig<T, V>) {
  const navigate = useNavigate();
  const { selectedFamilyId, familyData } = useFamilyDataContext();

  const entity = entityId ? findEntity(familyData, entityId) : undefined;

  const handleDelete = async () => {
    if (!entityId) return;
    try {
      await deleteEntity(entityId);
      navigate(`/app/family/${selectedFamilyId}`);
    } catch (error) {
      console.error(`Error deleting ${entityType}:`, error);
    }
  };

  const handleSubmit = async (values: V) => {
    const entityData = {
      ...values,
      family_id: selectedFamilyId,
    };

    console.log("entityData", entityType, entityData, createEntity);
    try {
      if (entityId) {
        await updateEntity({ ...entityData, id: entityId });
      } else {
        const newEntity = await createEntity(entityData);
        console.log(`Created new ${entityType}:`, newEntity);
      }
      // navigate(`/app/family/${selectedFamilyId}`);
    } catch (error) {
      console.error(`Error saving ${entityType}:`, error);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return {
    entity,
    handleDelete,
    handleSubmit,
    handleCancel,
  };
}
