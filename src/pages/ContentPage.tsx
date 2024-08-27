import React, { useEffect, useState } from 'react';
import { supabaseClient } from '../config/supabaseClient';

interface UserData {
    id: string;
    name: string;
    created_at: number;
    map_reference: string;
}

const ContentPage: React.FC = () => {
    const [data, setData] = useState<UserData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            const { data, error } = await supabaseClient
                .from('users')
                .select('*');

            if (error) {
                setError(error.message);
            } else {
                setData(data);
            }

            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>User Data</h1>
            <table border={1}>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>User Name</th>
                        <th>Created At</th>
                        <th>Map Reference</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.created_at}</td>
                            <td>{item.map_reference}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ContentPage;