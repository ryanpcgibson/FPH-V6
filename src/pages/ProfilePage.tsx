import React, { useEffect, useState } from 'react';
import { supabaseClient } from '../config/supabaseClient';

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

            const { data: { user } } = await supabaseClient.auth.getUser()

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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>User Profile</h1>
            {profile && (
                <div>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Full Name:</strong> {profile.display_name}</p>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
