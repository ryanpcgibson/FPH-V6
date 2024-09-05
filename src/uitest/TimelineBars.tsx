import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import HorizontalBar from './HorizontalBar';

const BottomDrawerContent: React.FC = () => {
    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h6" component="div" gutterBottom>
                Drawer Content
            </Typography>
            <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <HorizontalBar width={200} backgroundColor="grey.300" />
                    <HorizontalBar width={400} backgroundColor="grey.400" />
                    <HorizontalBar width={800} backgroundColor="grey.500" />
                    <HorizontalBar width={1200} backgroundColor="grey.600" />
                </Box>
            </Box>
        </Box>
    );
};

export default BottomDrawerContent;
