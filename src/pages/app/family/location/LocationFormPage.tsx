import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { useLocations } from "@/hooks/useLocations";
import LocationForm from "@/components/location/LocationForm";

const LocationFormPage = () => {
  const navigate = useNavigate();
  const { locationId: locationIdParam, familyId: familyIdParam } = useParams<{
    locationId?: string;
    familyId?: string;
  }>();
  
  const [currentFamilyId, setCurrentFamilyId] = useState(
    familyIdParam ? parseInt(familyIdParam, 10) : 0
  );
  const locationId = locationIdParam ? parseInt(locationIdParam, 10) : undefined;
  const { familyData, isLoading, error } = useFamilyDataContext();
  const { createLocation, updateLocation, deleteLocation } = useLocations();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading family data: {error.message}</div>;

  const location = locationId
    ? familyData?.locations.find((l) => l.id === locationId)
    : undefined;

  const handleFamilyChange = (newFamilyId: number) => {
    setCurrentFamilyId(newFamilyId);
  };

  const handleDelete = async () => {
    if (!locationId) return;
    try {
      await deleteLocation(locationId);
      navigate(`/app/family/${currentFamilyId}`);
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };

  const handleSubmit = async (values: {
    name: string;
    map_reference: string;
    start_date: Date | null;
    end_date: Date | null;
  }) => {
    const locationData = {
      name: values.name,
      map_reference: values.map_reference,
      start_date: values.start_date || undefined,
      end_date: values.end_date || undefined,
      family_id: currentFamilyId,
    };

    try {
      if (locationId) {
        await updateLocation({ ...locationData, id: locationId });
      } else {
        const newLocation = await createLocation(locationData);
        console.log('Created new location:', newLocation);
      }
      navigate(`/app/family/${currentFamilyId}`);
    } catch (error) {
      console.error("Error saving location:", error);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

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
