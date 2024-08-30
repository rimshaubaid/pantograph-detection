import React from 'react';
import { Typography, Box } from '@mui/material';

const Home = () => {
    return (
        <Box sx={{paddingTop:7}}>
            <Typography variant="h2" gutterBottom>
                Welcome to Home Page
            </Typography>
            <Typography variant="body1">
                This is the home page of your application.
            </Typography>
        </Box>
    );
};

export default Home;
