import React from 'react';
import Box from '@mui/material/Box';

interface HorizontalBarProps {
    width: number;
    backgroundColor: string;
}

const HorizontalBar: React.FC<HorizontalBarProps> = ({ width = 800, backgroundColor = "grey.300" }) => {
    return (
        <Box sx={{ height: 50, width, backgroundColor }} />
    );
};

export default HorizontalBar;