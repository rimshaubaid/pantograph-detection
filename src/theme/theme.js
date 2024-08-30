import { createTheme } from '@mui/material/styles/index.js';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1976d2', // Primary color for the dark theme
        },
        background: {
            default: '#121212', // Background color for the dark theme
            paper: '#1d1d1d', // Paper background color
        },
    },
    typography: {
        fontFamily: 'Montserrat, Arial, sans-serif',
        h1: { fontSize: '3rem' },
        h2: { fontSize: '2.5rem' },
        h3: { fontSize: '2rem' },
        h4: { fontSize: '1.75rem' },
        h5: { fontSize: '1.5rem' },
        h6: { fontSize: '1.75rem' },
        subtitle1: { fontSize: '1rem' },
        subtitle2: { fontSize: '0.875rem' },
        body1: { fontSize: '1rem' },
        body2: { fontSize: '0.975rem' },
        button: { fontSize: '0.875rem' },
        caption: { fontSize: '0.75rem' },
        overline: { fontSize: '0.75rem' },
    },
});

export default theme;
