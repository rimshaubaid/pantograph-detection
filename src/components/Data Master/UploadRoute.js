import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Button,
  Typography,
  Paper,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableBody,
  TableHead
} from '@mui/material';
import axios from 'axios';

const UploadRouteData = () => {
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState(null);
  const [data,setData] = useState([]);
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFileName(selectedFile.name);
      setFile(selectedFile); // Store the file in state
    }
  };
 
  useEffect(() => {
    getRouteData();
  }, []);

  const getRouteData = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/fetch-route-data"
      );
      setData(response?.data?.data);
    } catch (err) {

    }
  };

  const handleUploadFile = async () => {
    if (!file) {
      alert("Please select an XLSX file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // Append the selected file to FormData

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/upload-route-data",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.error) {
        alert(`Error: ${response.data.error}`);
      } else {
        alert("File uploaded successfully!");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
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
                accept=".xlsx"
                onChange={handleFileChange}
              />
            </Button>
            <Typography variant="body2" sx={{ marginTop: 1 }}>
              {fileName ? fileName : 'No file chosen'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#008080', width: '100%' }}
              onClick={handleUploadFile}
            >
              Upload Data File
            </Button>
          </Grid>
        </Grid>
        <TableContainer component={Paper} sx={{ marginTop: 2 , height:"60vh" , overflow:"auto" }}>
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
              {data.length > 0 ? (
                data.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.Route}</TableCell>
                    <TableCell>{row.Section}</TableCell>
                    <TableCell>{row.Location}</TableCell>
                    <TableCell>{row.Longtitude}</TableCell>
                    <TableCell>{row.Latitude}</TableCell>
                    <TableCell>{row.Height}</TableCell>
                    <TableCell>{row.FeatureENG}</TableCell>
                    <TableCell>{row.FeatureTRD}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No data available in table
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default UploadRouteData;
