
import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import BottomDrawerContent from './TimelineBars';

const UITestPage: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        setDrawerOpen(open);
    };

    return (
        <Container>
            <Box sx={{ textAlign: 'center', marginTop: 4 }}>
                <Typography variant="h2" component="h1" gutterBottom>
                    UI Test
                </Typography>
                <Box sx={{ marginTop: 2 }}>
                    <Typography variant="body1">
                        This is a welcome panel.
                    </Typography>
                </Box>
                <Box sx={{ marginTop: 4 }}>
                    <Button variant="contained" color="primary" onClick={toggleDrawer(true)}>
                        Open Bottom Drawer
                    </Button>
                </Box>
            </Box>
            <Drawer
                anchor="bottom"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
            >
                <BottomDrawerContent />
            </Drawer>
        </Container>
    );
};

export default UITestPage;