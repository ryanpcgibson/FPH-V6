import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useCreatePet } from '../hooks/usePetsData';
import { Pet } from '../db/db_types';

interface PetFormProps {
    petId?: number;
    familyId: number;
    initialData?: Partial<Pet>;
}

const PetForm: React.FC<PetFormProps> = ({ petId, familyId, initialData }) => {
    const [formData, setFormData] = React.useState(initialData || {});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData: Partial<Pet>) => ({ ...prevData, [name]: value }));
    };

    // Datepicker does not return event handler, like other fields
    const updateStartDate = (date: Date | null) => {
        setFormData((prevData: Partial<Pet>) => ({ ...prevData, start_date: date ?? undefined }));
    }

    const updateEndDate = (date: Date | null) => {
        setFormData((prevData: Partial<Pet>) => ({ ...prevData, end_date: date ?? undefined }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createPetMutation.mutateAsync(formData);
            // Handle success (e.g., show a success message, redirect, etc.)
        } catch (error) {
            // Handle error (e.g., show an error message)
            console.error('Error adding pet:', error);
        }
    };

    const handleDelete = () => {
        // TODO Handle delete
    }

    React.useEffect(() => {
        if (petId === null) {
            setFormData({ family_id: familyId });
        } else {
            setFormData(initialData || {});
        }
    }, [petId, familyId, initialData]);


    // TODO MobileDatePicker

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h6">{petId ? 'Update Pet' : 'Create Pet'}</Typography>
                <TextField
                    label="Name"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Family ID"
                    name="family_id"
                    type="number"
                    value={formData.family_id || ''}
                    onChange={handleChange}
                    InputProps={{
                        readOnly: true,
                    }}
                    required
                />
                <DatePicker
                    name="start_date"
                    label="Start Date"
                    views={['month', 'year']}
                    value={formData.start_date}
                    onChange={updateStartDate}
                />
                <DatePicker
                    name="end_date"
                    label="End Date"
                    views={['month', 'year']}
                    value={formData.end_date}
                    onChange={updateEndDate}
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
        </LocalizationProvider>
    );
};

export default PetForm;