import React from 'react';
import Box from '@mui/material/Box';
import HorizontalBar from './HorizontalBar';


interface TimelineBarsProps {
    data: { width: number; photo: string }[];
    onBarClick: (photo: string) => void;
}

const TimelineBars: React.FC<TimelineBarsProps> = ({ data, onBarClick }) => {
    return (
        <Box sx={{ padding: 2 }}>
            <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {data.map((item, index) => (
                        <HorizontalBar
                            key={index}
                            width={item.width}
                            backgroundColor={`grey.${300 + index * 100}`}
                            onClick={() => onBarClick(item.photo)}
                        />
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default TimelineBars;
