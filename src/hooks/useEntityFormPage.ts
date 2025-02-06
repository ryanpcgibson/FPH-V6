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
 *
 * @param config - Configuration object containing:
 *   - entityId: Optional ID of existing entity being edited
 *   - familyId: Optional ID of the family context
 *   - entityType: String identifier of the entity type (e.g., "pet", "location")
 *   - findEntity: Function to find an entity in the family data
 *   - createEntity: Function to create a new entity
 *   - updateEntity: Function to update an existing entity
 *   - deleteEntity: Function to delete an entity
 *
 * @returns An object containing:
 *   - currentFamilyId: The currently selected family ID
 *   - entity: The current entity being edited (if any)
 *   - isLoading: Loading state from family data context
 *   - error: Error state from family data context
 *   - handleFamilyChange: Handler for family selection changes
 *   - handleDelete: Handler for entity deletion
 *   - handleSubmit: Handler for form submission (create/update)
 *   - handleCancel: Handler for canceling form operation
 */
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
