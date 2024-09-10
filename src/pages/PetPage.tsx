// src/pages/PetPage.tsx

import React, { useState, useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PetForm from '../components/PetForm';
import PetDropdown from '../components/PetDropdown';
import { useFamilyData } from '../hooks/useFamilyData';
import { Pet } from '../db/db_types';

const PetPage: React.FC = () => {
  const { familyId } = useOutletContext<{ familyId: number | null }>();
  const { petId: petIdParam } = useParams<{ petId: string }>();
  const petId = petIdParam ? parseInt(petIdParam, 10) : null;

  const [selectedPetId, setSelectedPetId] = useState<number | null>(petId);
  const [initialData, setInitialData] = useState<Partial<Pet> | undefined>(undefined);

  // TODO should this be in a hook somewhere?
  const { data, error, isLoading } = useFamilyData(familyId);

  const handleSelectPet = (petId: number | null) => {
    setSelectedPetId(petId);
    if (petId === null) {
      setInitialData(undefined); // Clear form fields
    } else {
      const selectedPet = data?.pets.find((pet) => pet.id === petId);
      setInitialData(selectedPet ? { ...selectedPet } : undefined); // Fill form with selected pet's values
    }
  };

  useEffect(() => {
    handleSelectPet(selectedPetId);
    console.log('PetPage selectedPetId', selectedPetId);
  }, [petId, selectedPetId, data]);

  if (!familyId) {
    return (
      <Container>
        <Box sx={{ textAlign: 'center', marginTop: 4 }}>
          <Typography variant="h6" color="error">
            Error: No family ID provided in the URL.
          </Typography>
        </Box>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container>
        <Box sx={{ textAlign: 'center', marginTop: 4 }}>
          <Typography variant="h6">Loading...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ textAlign: 'center', marginTop: 4 }}>
          <Typography variant="h6" color="error">
            Error: {error.message}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ textAlign: 'center', marginTop: 4 }}>
        <PetDropdown familyId={familyId} selectedPetId={selectedPetId} onSelectPet={handleSelectPet} />
        <PetForm petId={selectedPetId || undefined} familyId={familyId} initialData={data?.pets.find(pet => pet.id === selectedPetId)} />
      </Box>
    </Container>
  );
};

export default PetPage;