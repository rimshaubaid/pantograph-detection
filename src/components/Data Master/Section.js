import React from 'react';
import { Container, Grid, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Edit,Delete } from '@mui/icons-material';
const sections = [

  // Add more entries as needed
];

const SectionManagement = () => {
  return (
    <Container sx={{ mt: 4,paddingTop:7  }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Create/Edit Section
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="route-select-label">Select Route</InputLabel>
              <Select
                labelId="route-select-label"
                id="route-select"
                label="Select Route"
              >
                <MenuItem value="PBE-TPU SL">PBE-TPU SL</MenuItem>
                <MenuItem value="TPU-PBE SL">TPU-PBE SL</MenuItem>
                {/* Add more routes as needed */}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Section Name" variant="outlined" />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Description" variant="outlined" />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item>
            <Button variant="contained" color="primary">
              Save Section
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
        <Table aria-label="sections table">
          <TableHead>
            <TableRow>
              <TableCell>S.No</TableCell>
              <TableCell>Route</TableCell>
              <TableCell>Section</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Active Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sections.map((section, index) => (
              <TableRow key={section.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{section.route}</TableCell>
                <TableCell>{section.section}</TableCell>
                <TableCell>{section.description}</TableCell>
                <TableCell>{section.active}</TableCell>
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

export default SectionManagement;
