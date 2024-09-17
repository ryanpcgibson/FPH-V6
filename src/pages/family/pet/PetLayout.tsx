// src/pages/Layout.tsx
import React from "react";
import { Outlet, useParams } from "react-router-dom";
import { PetDataProvider } from "@/context/PetDataContext";

const PetLayout: React.FC = () => {
  // TODO - default to first pet for family
  const { petId: petIdParam } = useParams<{ petId: string }>();
  const petId = petIdParam ? parseInt(petIdParam, 10) : null;

  if (petId === null) {
    return <div>Error: Pet ID is required</div>;
  }

  return (
    <PetDataProvider petId={petId}>
      <Outlet />
    </PetDataProvider>
  );
};

export default PetLayout;
