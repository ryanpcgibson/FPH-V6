// src/hooks/useFamilyData.ts
import { useQuery } from '@tanstack/react-query';
import { supabaseClient } from '../db/supabaseClient';
import { FamilyData, PetDB, LocationDB, MomentDB } from '../db/db_types';


const convertToDate = (dateString: string | undefined): Date | undefined => {
    return dateString ? new Date(dateString) : undefined;
};

const convertFamilyData = (data: any): FamilyData => {
    return {
        pets: data.pets.map((pet: PetDB) => ({
            ...pet,
            start_date: convertToDate(pet.start_date),
            end_date: convertToDate(pet.end_date || undefined),
        })),
        locations: data.locations.map((location: LocationDB) => ({
            ...location,
            start_date: convertToDate(location.start_date),
            end_date: convertToDate(location.end_date || undefined),
        })),
        users: data.users, // Assuming users don't have date fields
        moments: data.moments.map((moment: MomentDB) => ({
            ...moment,
            start_date: convertToDate(moment.start_date),
            end_date: convertToDate(moment.end_date || undefined),
        })),
    };
};

const fetchFamilyData = async (familyId: number): Promise<FamilyData> => {
    const { data, error } = await supabaseClient
        .rpc('get_family_records', { param_family_id: familyId });

    if (error) {
        throw new Error(error.message);
    }

    // Convert date strings to Date objects
    return convertFamilyData(data);
};

export const useFamilyData = (familyId: number | null) => {

    return useQuery({
        queryKey: ['familyData', familyId],
        queryFn: () => {
            if (familyId === null) {
                throw new Error('Family ID is null');
            }
            return fetchFamilyData(familyId);
            // let data = fetchFamilyData(familyId);
            // return data;
        }
    });
};