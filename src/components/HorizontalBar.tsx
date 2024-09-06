import React from 'react';
import Box from '@mui/material/Box';

interface HorizontalBarProps {
    width: number;
    backgroundColor: string;
    onClick: () => void;
}

const HorizontalBar: React.FC<HorizontalBarProps> = ({
    width = 800,
    backgroundColor = "grey.300",
    onClick = () => { alert('Horizontal bar clicked!'); }
}) => {
    return (
        <Box sx={{
            height: 50,
            width,
            backgroundColor
        }} onClick={onClick}
        />
    );
};

export default HorizontalBar;