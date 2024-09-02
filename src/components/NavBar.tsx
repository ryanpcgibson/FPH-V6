import React from 'react';
import { useAuth } from '../hooks/Auth';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
    const { user, signOut } = useAuth();

    const handleLogout = async () => {
        await signOut();
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    My App
                </Typography>
                <Button color="inherit" component={Link} to="/">Welcome</Button>
                {user ? (
                    <>
                        <Button color="inherit" component={Link} to="/data">Data</Button>
                        <Button color="inherit" component={Link} to="/profile">Profile</Button>
                        <Button color="inherit" onClick={handleLogout}>Logout {user.email}</Button>
                    </>
                ) : (
                    <Button color="inherit" component={Link} to="/login">Login</Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;