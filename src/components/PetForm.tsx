// src/components/PetForm.tsx

import React, { useState, useEffect } from 'react';
import { useCreatePet, useUpdatePet, useDeletePet } from '../hooks/usePetsData';
import { Pet, PetInsert } from '../db/db_types';
import { Box, Button, TextField, Typography } from '@mui/material';

interface PetFormProps {
    petId?: number;
    initialData?: Partial<Pet>;
}

const PetForm: React.FC<PetFormProps> = ({ petId, initialData }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [endDate, setEndDate] = useState(initialData?.end_date || '');
    const [familyId, setFamilyId] = useState(initialData?.family_id || 0);
    const [startDate, setStartDate] = useState(initialData?.start_date || '');
    const createPetMutation = useCreatePet();
    const updatePetMutation = useUpdatePet();
    const deletePetMutation = useDeletePet();

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setEndDate(initialData.end_date || '');
            setFamilyId(initialData.family_id || 0);
            setStartDate(initialData.start_date || '');
        }
    }, [initialData]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const petData: PetsInsert = {
            name,
            end_date: endDate ? new Date(endDate) : undefined,
            family_id: familyId,
            start_date: startDate ? new Date(startDate) : undefined,
        };

        if (petId) {
            updatePetMutation.mutate({ petId, updatedPetData: petData });
        } else {
            createPetMutation.mutate(petData);
        }
    };

    const handleDelete = () => {
        if (petId) {
            deletePetMutation.mutate(petId);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6">{petId ? 'Update Pet' : 'Create Pet'}</Typography>
            <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <TextField
                label="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
            />
            <TextField
                label="Family ID"
                type="number"
                value={familyId}
                onChange={(e) => setFamilyId(Number(e.target.value))}
                required
            />
            <TextField
                label="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
            />
            <Button type="submit" variant="contained" color="primary">
                {petId ? 'Update' : 'Create'}
            </Button>
            {petId && (
                <Button variant="contained" color="secondary" onClick={handleDelete}>
                    Delete
                </Button>
            )}
        </Box>
    );
};

export default PetForm;