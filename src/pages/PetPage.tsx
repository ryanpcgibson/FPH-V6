
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import PetForm from '../components/PetForm';

function WelcomePage() {
    return (
        <Container>
            <Box sx={{ textAlign: 'center', marginTop: 4 }}>
                <PetForm />
            </Box>
        </Container >
    );
}

export default WelcomePage;