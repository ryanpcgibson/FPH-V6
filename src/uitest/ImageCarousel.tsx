import React, { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const images = [
    'https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68',
    'https://fastly.picsum.photos/id/19/2500/1667.jpg?hmac=7epGozH4QjToGaBf_xb2HbFTXoV5o8n_cYzB7I4lt6g',
    'https://fastly.picsum.photos/id/24/4855/1803.jpg?hmac=ICVhP1pUXDLXaTkgwDJinSUS59UWalMxf4SOIWb9Ui4',
];

const ImageCarousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <Box
            component="img"
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
        />
    );
};

export default ImageCarousel;


// <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%' }}>
// {/* <IconButton onClick={handlePrev}>
//     <ArrowBackIosIcon />
// </IconButton> */}
//     {/* <IconButton onClick={handleNext}>
//         <ArrowForwardIosIcon />
//     </IconButton> */}
// // </Box>
