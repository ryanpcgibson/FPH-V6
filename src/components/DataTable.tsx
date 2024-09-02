import React, { useEffect, useState } from 'react';
import { supabaseClient } from '../config/supabaseClient';
import { JsonToTable } from "react-json-to-table";
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

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

    if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>;
    if (error) return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><Typography color="error">{error}</Typography></Box>;

    return (
        <Paper sx={{ margin: 2, padding: 2 }}>
            <Typography variant="h6" component="div" gutterBottom>
                {tableName}
            </Typography>
            <Typography variant="subtitle1" component="div" gutterBottom>
                Query: {query}
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
                <JsonToTable json={data} />
            </Box>
        </Paper>
    );
};

export default DataTable;