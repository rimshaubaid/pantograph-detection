import React, { useState } from "react";
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

const SparkDataView = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [format, setFormat] = useState("text");
  const [fileType, setFileType] = useState("excel");

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);
  const handleFormatChange = (event) => setFormat(event.target.value);
  const handleFileTypeChange = (event) => setFileType(event.target.value);

  const handleDownload = () => {
    // Handle the download logic based on format and fileType
    console.log(`Downloading ${format} as ${fileType}`);
    handleDialogClose();
  };

  return (
    <Box
      sx={{
        padding: 4,
        bgcolor: "#1c1c1c",
        minHeight: "100vh",
        color: "#fff",
        paddingTop: 7,
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: 4, color: "#00E5FF" }}>
        View Data
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ padding: 3, bgcolor: "#2c2c2c" }}>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <FormControl
                  fullWidth
                  sx={{ bgcolor: "#333", borderRadius: 1 }}
                >
                  <InputLabel sx={{ color: "#fff" }}>Route Name</InputLabel>
                  <Select defaultValue="" sx={{ color: "#fff" }}>
                    <MenuItem value="">--Select Routes--</MenuItem>
                    {/* Add your route options here */}
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
            </Grid>

            <TableContainer
              component={Paper}
              sx={{ marginTop: 2, bgcolor: "#333" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>S.No</TableCell>
                    <TableCell>Section</TableCell>
                    <TableCell>Stagger</TableCell>
                    <TableCell>Previous Location</TableCell>
                    <TableCell>Next Location</TableCell>
                    <TableCell>PantoHeight</TableCell>
                    <TableCell>Distance</TableCell>
                   
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      No data available in table
                    </TableCell>
                  </TableRow>
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
                count={0}
                page={0}
                onPageChange={() => {}}
                rowsPerPage={50}
                onRowsPerPageChange={() => {}}
                sx={{ bgcolor: "#2c2c2c", color: "#fff" }}
              />
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginRight: 2 }}
                >
                  Update Records
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleDialogOpen}
                >
                  Download Report
                </Button>
              </Box>
            </Box>
          </Paper>
          <Grid container sx={{ marginTop: 3 }}>
            <Grid xs={2}>
              <Button onClick={handleDialogOpen} variant="contained">
                OHE Height
              </Button>
            </Grid>

            <Grid xs={2}>
              {" "}
              <Button onClick={handleDialogOpen} variant="contained">
                Stagger
              </Button>
            </Grid>
            <Grid xs={2}>
              {" "}
              <Button onClick={handleDialogOpen} variant="contained">
                Gradient
              </Button>
            </Grid>
            <Grid xs={2}>
              {" "}
              <Button onClick={handleDialogOpen} variant="contained">
                IOL
              </Button>
            </Grid>
            <Grid xs={2}>
              {" "}
              <Button onClick={handleDialogOpen} variant="contained">
                UIOL
              </Button>
            </Grid>
            <Grid xs={2}>
              {" "}
              <Button onClick={handleDialogOpen} variant="contained">
                X/0 & T/0
              </Button>
            </Grid>
          </Grid>
          <Grid container sx={{ marginTop: 4 }}>
            <Grid xs={2}>
              {" "}
              <Button onClick={handleDialogOpen} variant="contained">
                All data
              </Button>
            </Grid>
            <Grid xs={3}>
              {" "}
              <Button onClick={handleDialogOpen} variant="contained">
                Wire condition
              </Button>
            </Grid>
            <Grid xs={2}>
              {" "}
              <Button onClick={handleDialogOpen} variant="contained">
                Insulator
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={4}>
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
        </Grid>
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
