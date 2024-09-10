import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useParams } from 'react-router-dom';
import { useFamilyData } from '../hooks/useFamilyData';
import { JsonToTable } from "react-json-to-table";

const ContentPage: React.FC = () => {

    const { id } = useParams<{ id: string }>();
    // if (!id) {
    //     return (
    //         <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
    //             <Typography color="error">Family ID is required.</Typography>
    //         </Box>
    //     );
    // }
    // TODO - default to first family for user
    const familyIdNumber = id ? parseInt(id, 10) : 7;


    const { data, error, isLoading } = useFamilyData(familyIdNumber);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography color="error">{error.message}</Typography>
            </Box>
        );
    }

    return (
        <Container>
            <Typography variant="h4" component="div" gutterBottom>
                Data for {familyIdNumber ? `Family ${familyIdNumber}` : 'All Families'}
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
                <JsonToTable json={data} />
            </Box>

            {/* 
            <DataTable tableName="families" query="id, name, *, family_users(users(*),member_type)" />
            <DataTable tableName="locations" query="id, name, *" />
            <DataTable tableName="pets" query="id, name, *" />
            <DataTable tableName="moments" query="*, pet_moments(pets(*)),photos(*) " /> */}
        </Container>
    );
};

export default ContentPage;