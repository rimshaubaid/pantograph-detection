import React from 'react';
import { Container, Grid, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton } from '@mui/material';
import {Edit,Delete} from '@mui/icons-material';


const routes = [

];

const RouteManagement = () => {
  return (
    <Container sx={{ mt: 4,paddingTop:7 }}>
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
