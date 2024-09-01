import React, { useEffect, useState } from 'react';
import { supabaseClient } from '../config/supabaseClient';
import { JsonToTable } from "react-json-to-table";

interface DataTableProps {
    tableName: string;
    query: string;
}

const DataTable: React.FC<DataTableProps> = ({ tableName, query }) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            const { data, error } = await supabaseClient
                .from(tableName)
                .select(query);

            if (error) {
                setError(error.message);
            } else {
                setData(data);
                console.log(data);
            }

            setLoading(false);
        };

        fetchData();
    }, [tableName, query]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>{tableName}</h1>
            <h3>Query: {query}</h3>
            <JsonToTable json={data} />
        </div>
    );
};

export default DataTable;