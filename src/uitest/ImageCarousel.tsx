import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';

interface ImageCarouselProps {
    photo: string;
    closeDrawer: () => void;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ photo, closeDrawer }) => {
    const handleNext = () => {
        // Implement the logic to handle the next image
    };

    const handlePrev = () => {
        // Implement the logic to handle the previous image
    };

    return (
        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
            <IconButton
                onClick={handlePrev}
                sx={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    },
                }}
            >
                <ArrowBackIosIcon />
            </IconButton>
            <Box
                component="img"
                src={photo}
                alt="Current Image"
                sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
            />
            <IconButton
                onClick={handleNext}
                sx={{
                    position: 'absolute',
                    right: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    },
                }}
            >
                <ArrowForwardIosIcon />
            </IconButton>
            <IconButton
                onClick={closeDrawer}
                sx={{
                    position: 'absolute',
                    right: 16,
                    top: 16,
                    zIndex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    },
                }}
            >
                <CloseIcon />
            </IconButton>
        </Box>
    );
};

export default ImageCarousel;
