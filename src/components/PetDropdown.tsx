// src/components/PetDropdown.tsx

import React from 'react';
import { useFamilyData } from '../hooks/useFamilyData';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

interface PetDropdownProps {
    familyId: number;
    selectedPetId: number | null;
    onSelectPet: (petId: number | null) => void;
}

const PetDropdown: React.FC<PetDropdownProps> = ({ familyId, selectedPetId, onSelectPet }) => {
    const { data, isLoading, error } = useFamilyData(familyId);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading family data</div>;

    return (
        <FormControl fullWidth>
            <InputLabel id="pet-select-label">Select Pet</InputLabel>
            <Select
                labelId="pet-select-label"
                value={selectedPetId !== null ? selectedPetId : ''}
                onChange={(e) => onSelectPet(e.target.value === '' ? null : Number(e.target.value))}
                label="Select Pet"
            >
                <MenuItem value={''}>Insert new...</MenuItem>
                {data?.pets.map((pet) => (
                    <MenuItem key={pet.id} value={pet.id}>
                        {pet.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default PetDropdown;