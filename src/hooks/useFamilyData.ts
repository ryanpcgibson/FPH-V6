// src/hooks/useFamilyData.ts
import { useQuery } from '@tanstack/react-query';
import { supabaseClient } from '../config/supabaseClient';

const fetchFamilyData = async (familyId: number) => {
    const { data, error } = await supabaseClient
        .rpc('get_family_records', { param_family_id: familyId });

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const useFamilyData = (familyId: number) => {

    return useQuery({
        queryKey: ['familyData', familyId],
        queryFn: () => fetchFamilyData(familyId)
    });
};