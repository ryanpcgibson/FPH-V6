import React, { useEffect, useState } from 'react';
import { supabaseClient } from '../config/supabaseClient';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

interface UserProfile {
    id: string;
    email: string | null;
    display_name: string | null;
}

const UserProfile: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);

            const { data: { user } } = await supabaseClient.auth.getUser();

            if (user && user.email) {
                setProfile({
                    id: user.id,
                    email: user.email,
                    display_name: user.user_metadata.display_name
                });
            } else {
                setError('User not authenticated');
            }

            setLoading(false);
        };

        fetchProfile();
    }, []);

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress />
        </Box>
    );
    if (error) return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Typography color="error">{error}</Typography>
        </Box>
    );

    return (
        <Container>
            <Box sx={{ textAlign: 'center', marginTop: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    User Profile
                </Typography>
                <Box sx={{ marginTop: 2 }}>
                    <Typography variant="body1">
                        <strong>Email:</strong> {profile?.email}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Display Name:</strong> {profile?.display_name}
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default UserProfile;
