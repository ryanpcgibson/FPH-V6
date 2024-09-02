
import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function WelcomePage() {
    return (
        <Container>
            <Box sx={{ textAlign: 'center', marginTop: 4 }}>
                <Typography variant="h2" component="h1" gutterBottom>
                    Welcome
                </Typography>
                <Box sx={{ marginTop: 2 }}>
                    <Typography variant="body1">
                        This is a welcome panel.
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}

export default WelcomePage;