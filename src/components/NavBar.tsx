import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/Auth';

const NavBar: React.FC = () => {
    const { user, signOut } = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await signOut();
        handleMenuClose();
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    FPH
                </Typography>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleMenuOpen}
                >
                    <MenuIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem component={Link} to="/" onClick={handleMenuClose}>Welcome</MenuItem>
                    {user ? (
                        [
                            <MenuItem key="data" component={Link} to="/data" onClick={handleMenuClose}>Data</MenuItem>,
                            <MenuItem key="uitest" component={Link} to="/uitest" onClick={handleMenuClose}>UI Test</MenuItem>,
                            <MenuItem key="profile" component={Link} to="/profile" onClick={handleMenuClose}>Profile</MenuItem>,
                            <MenuItem key="logout" onClick={handleLogout}>Logout {user.email}</MenuItem>
                        ]
                    ) : (
                        <MenuItem component={Link} to="/login" onClick={handleMenuClose}>Login</MenuItem>
                    )}
                </Menu>
                {/* <div sx={{ display: { xs: 'none', md: 'flex' } }}>
                    <Button color="inherit" component={Link} to="/">Welcome</Button>
                    {user ? (
                        <>
                            <Button color="inherit" component={Link} to="/data">Data</Button>
                            <Button color="inherit" component={Link} to="/uitest">UI Test</Button>
                            <Button color="inherit" component={Link} to="/profile">Profile</Button>
                            <Button color="inherit" onClick={handleLogout}>Logout {user.email}</Button>
                        </>
                    ) : (
                        <Button color="inherit" component={Link} to="/login">Login</Button>
                    )}
                </div> */}
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;