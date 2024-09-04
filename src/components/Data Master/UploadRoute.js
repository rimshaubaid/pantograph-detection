import React, { useState } from 'react';
import {
  Container,
  Grid,
  Button,
  Select,
  MenuItem,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TextField,
  InputLabel,
  FormControl,
} from '@mui/material';

const UploadRouteData = () => {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 7 }}>
      <Paper sx={{ padding: 2, backgroundColor: '#333', color: '#fff' }}>
        <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>
          Upload Route Data
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              component="label"
              sx={{ backgroundColor: '#008080' }}
            >
              Choose File
              <input
                type="file"
                hidden
                accept=".xlsx, .xls, .pdf"
                onChange={handleFileChange}
              />
            </Button>
            <Typography variant="body2" sx={{ marginTop: 1 }}>
              {fileName ? fileName : 'No file chosen'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#fff' }}>Select Route</InputLabel>
              <Select
                defaultValue=""
                label="Select Route"
                sx={{ color: '#fff' }}
              >
                <MenuItem value="">
                  <em>-- Select Route --</em>
                </MenuItem>
                {/* Add route options here */}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#008080', width: '100%' }}
            >
              Upload Data File
            </Button>
          </Grid>
        </Grid>
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>S.No</TableCell>
                <TableCell>Route</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Longitude</TableCell>
                <TableCell>Latitude</TableCell>
                <TableCell>Height</TableCell>
                <TableCell>Feature ENG</TableCell>
                <TableCell>Feature TRD</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Add table rows here */}
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No data available in table
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default UploadRouteData;
