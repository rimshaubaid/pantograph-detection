import React from 'react';
import { Container, Grid, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton } from '@mui/material';
import {Edit,Delete} from '@mui/icons-material';


const routes = [
  { id: 1, route: 'PBE-TPU SL', description: 'SL', active: 1 },
  { id: 2, route: 'TPU-PBE SL', description: 'SL', active: 1 },
  { id: 3, route: 'MRJ-SNE', description: 'None', active: 1 },
  { id: 4, route: 'NCB-SRPB UP', description: 'UP', active: 1 },
  { id: 5, route: 'SRPB-NCB DN', description: 'DN', active: 1 },
  { id: 6, route: 'PBE-TPU SL-01', description: 'SL', active: 1 },
  { id: 7, route: 'BLSN-ANMD SL', description: 'None', active: 1 },
  { id: 8, route: 'PBE-TPU SL-02', description: 'None', active: 1 },
  { id: 9, route: 'PBE-TPU SL-03', description: 'None', active: 1 },
  { id: 10, route: 'PBE-TPU SL-04', description: 'None', active: 1 },
  { id: 11, route: 'All-DET SL', description: 'None', active: 1 },
];

const RouteManagement = () => {
  return (
    <Container sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Create/Edit Route
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Route Name" variant="outlined" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Description" variant="outlined" />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item>
            <Button variant="contained" color="primary">
              Save Route
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="secondary">
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table aria-label="routes table">
          <TableHead>
            <TableRow>
              <TableCell>S.No</TableCell>
              <TableCell>Route</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Active</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {routes.map((route, index) => (
              <TableRow key={route.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{route.route}</TableCell>
                <TableCell>{route.description}</TableCell>
                <TableCell>{route.active}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default RouteManagement;
