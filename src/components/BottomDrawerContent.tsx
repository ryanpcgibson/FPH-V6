import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const BottomDrawerContent: React.FC = () => {
    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h6" component="div" gutterBottom>
                Drawer Content
            </Typography>
            <Typography variant="body1">
                This is the content inside the bottom drawer.
            </Typography>
        </Box>
    );
};

export default BottomDrawerContent;