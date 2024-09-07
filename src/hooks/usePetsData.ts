import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseClient } from '../db/supabaseClient';
import { Pet, PetInsert, PetUpdate } from '../db/db_types_extended';

// Create a new pet
export const useCreatePet = () => {
    const queryClient = useQueryClient();

    return useMutation<Pet[], Error, PetInsert>({
        mutationFn: async (newPetData) => {
            try {
                console.log('useCreatePet newPetData', newPetData);
                if (!newPetData.name || !newPetData.start_date || !newPetData.family_id) {
                    throw new Error('Please provide a name, start date, and family ID');
                }

                const startDate = newPetData.start_date instanceof Date ? newPetData.start_date : new Date(newPetData.start_date);
                const endDate = newPetData.end_date ? (newPetData.end_date instanceof Date ? newPetData.end_date : new Date(newPetData.end_date)) : undefined;


                const { data, error } = await supabaseClient
                    .from('pets')
                    .insert({
                        ...newPetData,
                        start_date: startDate.toISOString(),
                        end_date: endDate ? endDate.toISOString() : undefined
                    })
                    .select();

                if (error) {
                    console.error('useCreatePet error', error);
                    throw new Error(error.message);
                }

                console.log('useCreatePet data', data);

                // Transform the date fields from strings to Date objects
                const transformedData = data?.map(pet => ({
                    ...pet,
                    start_date: pet.start_date ? new Date(pet.start_date) : undefined,
                    end_date: pet.end_date ? new Date(pet.end_date) : undefined,
                })) as Pet[];

                console.log('useCreatePet transformedData', transformedData);

                return transformedData || [];
            } catch (err) {
                console.error('useCreatePet caught error', err);
                throw err;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['familyData'] });
        },
    });
};

// Update an existing pet
export const useUpdatePet = () => {
    const queryClient = useQueryClient();

    return useMutation<Pet[], Error, { petId: number; updatedPetData: PetUpdate }>({
        mutationFn: async ({ petId, updatedPetData }) => {
            try {
                console.log('useUpdatePet updatedPetData', updatedPetData);
                if (!updatedPetData.name || !updatedPetData.start_date || !updatedPetData.family_id) {
                    throw new Error('Please provide a name, start date, and family ID');
                }
                const { data, error } = await supabaseClient
                    .from('pets')
                    .update({
                        ...updatedPetData,
                        start_date: updatedPetData.start_date.toISOString(),
                        end_date: updatedPetData.end_date ? updatedPetData.end_date.toISOString() : undefined
                    })
                    .eq('id', petId)
                    .select();

                if (error) {
                    console.error('useUpdatePet error', error);
                    throw new Error(error.message);
                }

                console.log('useUpdatePet data', data);

                // Transform the date fields from strings to Date objects
                const transformedData = data?.map(pet => ({
                    ...pet,
                    start_date: pet.start_date ? new Date(pet.start_date) : undefined,
                    end_date: pet.end_date ? new Date(pet.end_date) : undefined,
                })) as Pet[];

                console.log('useUpdatePet transformedData', transformedData);

                return transformedData || [];
            } catch (err) {
                console.error('useUpdatePet caught error', err);
                throw err;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['familyData'] });
        },
    });
};

// Delete a pet
export const useDeletePet = () => {
    const queryClient = useQueryClient();

    return useMutation<null, Error, number>({
        mutationFn: async (petId) => {
            const { error } = await supabaseClient
                .from('pets')
                .delete()
                .eq('id', petId);

            if (error) {
                throw new Error(error.message);
            }

            return null;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['familyData'] });
        },
    });
};

// New code block
export const useNewFunction = () => {
    // Add your code here
};