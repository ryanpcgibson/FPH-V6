import React from 'react';
import DataTable from '../components/DataTable';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const ContentPage: React.FC = () => {
    return (
        <Container>
            <Typography variant="h4" component="div" gutterBottom>
                Data
            </Typography>
            <DataTable tableName="families" query="id, name, *, family_users(users(*),member_type)" />
            <DataTable tableName="locations" query="id, name, *" />
            <DataTable tableName="pets" query="id, name, *" />
            <DataTable tableName="moments" query="*, pet_moments(pets(*)),photos(*) " />
        </Container>
    );
};

export default ContentPage;