import React from 'react';
import { useAuth } from '../hooks/Auth';

const NavBar: React.FC = () => {
    const { user, signOut } = useAuth();

    const handleLogout = async () => {
        await signOut();
    };

    const NavButton = ({ label, path }: { label: string, path: string }) => {
        return (
            <button onClick={() => window.location.href = path}>
                {label}
            </button>
        );
    };

    return (
        <nav>
            <NavButton label="Welcome" path="/" />
            {user ? (
                <>
                    <NavButton label="Content" path="/content" />
                    <NavButton label="Profile" path="/profile" />
                    <button onClick={handleLogout}>
                        Logout {user.email}
                    </button>
                </>
            ) : (
                <NavButton label="Login" path="/login" />
            )}
        </nav>
    );
};

export default NavBar;