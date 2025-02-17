import React from "react";
import { useParams } from "react-router-dom";
import { useLocations } from "@/hooks/useLocations";
import LocationForm from "@/components/location/LocationForm";
import { useEntityFormPage } from "@/hooks/useEntityFormPage";
import type { Location } from "@/db/db_types";
import { LocationFormValues } from "@/components/location/LocationForm";

const LocationFormPage = () => {
  const { locationId: locationIdParam } = useParams<{
    locationId?: string;
  }>();
  const locationId = locationIdParam
    ? parseInt(locationIdParam, 10)
    : undefined;

  const { createLocation, updateLocation, deleteLocation } = useLocations();

  const {
    entity: location,
    handleDelete,
    handleSubmit,
    handleCancel,
  } = useEntityFormPage<Location, LocationFormValues>({
    entityId: locationId,
    entityType: "location",
    findEntity: (data, id) => data?.locations.find((l) => l.id === id),
    createEntity: (data) => createLocation(data),
    updateEntity: (data) => updateLocation(data),
    deleteEntity: (id) => deleteLocation(id),
  });

  return (
    <div className="w-full h-full" id="page-container">
      <LocationForm
        locationId={locationId}
        initialData={location}
        onDelete={handleDelete}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default LocationFormPage;
