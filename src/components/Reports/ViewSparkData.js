import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import axios from "axios";

const SparkDataView = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [format, setFormat] = useState("text");
  const [fileType, setFileType] = useState("excel");
  const [data, setData] = useState([]); // State for storing API data
  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);
  const handleFormatChange = (event) => setFormat(event.target.value);
  const handleFileTypeChange = (event) => setFileType(event.target.value);
  const [page, setPage] = useState(0); // For pagination
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page
  const handleDownload = () => {
    // Handle the download logic based on format and fileType
    console.log(`Downloading ${format} as ${fileType}`);
    handleDialogClose();
  };
  // Pagination and rows per page change handler
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };
  useEffect(() => {
    getData();
  }, []);

  
  const getData = async () => {
    try {
      const response = await axios.get(
        "http://81.208.170.168:5000/fetch-report-data"
      );

      setData(response?.data?.data); // Set the fetched data into state
    } catch (err) {
      console.log("er", err);
    }
  };

  return (
    <Box
      sx={{
        padding: 4,
        bgcolor: "#1c1c1c",
        minHeight: "100vh",
        color: "#fff",
        paddingTop: 10,
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: 4, color: "#00E5FF" }}>
        View Data
      </Typography>

      <Grid container spacing={2}>
        <Grid item  xs={8}>
          <Paper sx={{ padding: 3, bgcolor: "#2c2c2c" }}>
            {/* <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <FormControl
                  fullWidth
                  sx={{ bgcolor: "#333", borderRadius: 1 }}
                >
                  <InputLabel sx={{ color: "#fff" }}>Route Name</InputLabel>
                  <Select defaultValue="" sx={{ color: "#fff" }}>
                    <MenuItem value="">--Select Routes--</MenuItem>

                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  label="Session"
                  variant="outlined"
                  fullWidth
                  sx={{ bgcolor: "#333", borderRadius: 1 }}
                />
              </Grid>
            </Grid> */}

            <TableContainer
              component={Paper}
              sx={{ marginTop: 2, bgcolor: "#333",overflow:"auto",height:"50vh" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell>Route</TableCell>
                    <TableCell>Section</TableCell>
                    <TableCell>CP1</TableCell>
                    <TableCell>CP2</TableCell>
                    <TableCell>CP3</TableCell>
                    <TableCell>CP4</TableCell>
                    <TableCell>CP5</TableCell>
                    <TableCell>Feature ENG</TableCell>
                    <TableCell>Feature TRD</TableCell>
                    <TableCell>Frame Number</TableCell>
                    <TableCell>Height</TableCell>
                    <TableCell>Imp</TableCell>
                    <TableCell>Inclination</TableCell>
                    <TableCell>PantoHeight</TableCell>
                    <TableCell>KM</TableCell>
                    <TableCell>Lat</TableCell>
                    <TableCell>Long</TableCell>
                    <TableCell>Meter</TableCell>
                    <TableCell>Uplift Force</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.length > 0 ? (
                      data
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.route}</TableCell>
                        <TableCell>{item.section}</TableCell>
                        <TableCell>{item.cp1 || "-"}</TableCell>
                        <TableCell>{item.cp2 || "-"}</TableCell>
                        <TableCell>{item.cp3 || "-"}</TableCell>
                        <TableCell>{item.c4 || "-"}</TableCell>
                        <TableCell>{item.cp5 || "-"}</TableCell>
                        <TableCell>{item.feature_eng}</TableCell>
                        <TableCell>{item.feature_trd}</TableCell>
                        <TableCell>{item.frame_number}</TableCell>
                        <TableCell>{item.height}</TableCell>
                        <TableCell>{item.imp}</TableCell>
                        <TableCell>{item.inclination}</TableCell>
                        <TableCell>{item.pantograph_height}</TableCell>
                        <TableCell>{item.km}</TableCell>
                        <TableCell>{item.lat}</TableCell>
                        <TableCell>{item.long}</TableCell>
                        <TableCell>{item.meter}</TableCell>
                        <TableCell>{item.uplift_force}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={20} align="center">
                        No data available in table
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box
              sx={{
                marginTop: 2,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
               
              <TablePagination
               component="div"
               count={data.length}
               page={page}
               onPageChange={handlePageChange}
               rowsPerPage={rowsPerPage}
               onRowsPerPageChange={handleRowsPerPageChange}
               sx={{ bgcolor: "#2c2c2c", color: "#fff" }}
              />
              <Box>
                {/* <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginRight: 2 }}
                >
                  Update Records
                </Button> */}
                {/* <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleDialogOpen}
                >
                  Download Report
                </Button> */}
              </Box>
            </Box>
          </Paper>
        
         
        </Grid>
        <Grid item  xs={4}>
  <Grid container spacing={2} sx={{ marginTop: 3 }}>
    {/* First Row */}
    <Grid item xs={6}>
      <Button onClick={handleDialogOpen} variant="contained" fullWidth>
        OHE Height
      </Button>
    </Grid>
    <Grid item xs={6}>
      <Button onClick={handleDialogOpen} variant="contained" fullWidth>
        Stagger
      </Button>
    </Grid>

    {/* Second Row */}
    <Grid item xs={6}>
      <Button onClick={handleDialogOpen} variant="contained" fullWidth>
        Gradient
      </Button>
    </Grid>
    <Grid item xs={6}>
      <Button onClick={handleDialogOpen} variant="contained" fullWidth>
        IOL
      </Button>
    </Grid>

    {/* Third Row */}
    <Grid item xs={6}>
      <Button onClick={handleDialogOpen} variant="contained" fullWidth>
        UIOL
      </Button>
    </Grid>
    <Grid item xs={6}>
      <Button onClick={handleDialogOpen} variant="contained" fullWidth>
        X/0 & T/0
      </Button>
    </Grid>

    {/* Fourth Row */}
    <Grid item xs={6}>
      <Button onClick={handleDialogOpen} variant="contained" fullWidth>
        All data
      </Button>
    </Grid>
    <Grid item xs={6}>
      <Button onClick={handleDialogOpen} variant="contained" fullWidth>
        Wire condition
      </Button>
    </Grid>

    {/* Fifth Row */}
    <Grid item xs={6}>
      <Button onClick={handleDialogOpen} variant="contained" fullWidth>
        Insulator
      </Button>
    </Grid>
  </Grid>
</Grid>

        {/* <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "#333", color: "#00E5FF" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 2,
                }}
              >
                <PhotoCamera sx={{ fontSize: 100 }} />
              </Box>
              <Typography variant="body1">Route: 00000.00000</Typography>
              <Typography variant="body1">Section: </Typography>
              <Typography variant="body1">Longitude: 00000.00000</Typography>
              <Typography variant="body1">Latitude: 00000.00000</Typography>
              <Typography variant="body1">Height: 000.00 (Mtrs)</Typography>
              <Typography variant="body1">Speed: 000.00 (KMPH)</Typography>
              <Typography variant="body1">Satellites: 00</Typography>
              <Typography variant="body1">Intensity: 000</Typography>
              <Typography variant="body1">Distance: 00.00m</Typography>
              <Typography variant="body1">
                Taken At: YYYY-MM-DD-HH:MM:SS
              </Typography>
            </CardContent>
          </Card>
        </Grid> */}
      </Grid>

      {/* Dialog Component */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Select Download Options</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 2 }}>
            <InputLabel>Format</InputLabel>
            <Select value={format} onChange={handleFormatChange} label="Format">
              <MenuItem value="text">Text Only</MenuItem>
              <MenuItem value="image">Image Only</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>File Type</InputLabel>
            <Select
              value={fileType}
              onChange={handleFileTypeChange}
              label="File Type"
            >
              <MenuItem value="excel">Excel</MenuItem>
              <MenuItem value="pdf">PDF</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDownload}>Download</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SparkDataView;
