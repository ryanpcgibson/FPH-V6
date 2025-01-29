import React from "react";
import { useParams } from "react-router-dom";
import { useLocations } from "@/hooks/useLocations";
import LocationForm from "@/components/location/LocationForm";
import { useEntityFormPage } from "@/hooks/useEntityFormPage";
import type { Location } from "@/db/db_types";

interface LocationFormValues {
  name: string;
  map_reference: string;
  start_date: Date | null;
  end_date: Date | null;
}

const LocationFormPage = () => {
  const { locationId: locationIdParam, familyId: familyIdParam } = useParams<{
    locationId?: string;
    familyId?: string;
  }>();

  const locationId = locationIdParam
    ? parseInt(locationIdParam, 10)
    : undefined;
  const { createLocation, updateLocation, deleteLocation } = useLocations();

  const {
    currentFamilyId,
    entity: location,
    isLoading,
    error,
    handleFamilyChange,
    handleDelete,
    handleSubmit,
    handleCancel,
  } = useEntityFormPage<Location, LocationFormValues>({
    entityId: locationId,
    familyId: familyIdParam ? parseInt(familyIdParam, 10) : undefined,
    entityType: "location",
    findEntity: (data, id) => data?.locations.find((l) => l.id === id),
    createEntity: createLocation,
    updateEntity: updateLocation,
    deleteEntity: deleteLocation,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading family data: {error.message}</div>;

  return (
    <LocationForm
      locationId={locationId}
      familyId={currentFamilyId}
      onFamilyChange={handleFamilyChange}
      initialData={location}
      onDelete={handleDelete}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

export default LocationFormPage;
