import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Menu,
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
  Checkbox
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;
  // Convert data to CSV format
  const headers = [
    "Id",
    "Route",
    "Section",
    "CP 1",
    "CP 2",
    "CP 3",
    "CP 4",
    "CP 5",
    "Feature ENG",
    "Feature TRD",
    
  ];

  const masterReportHeaders = [
    "Distance Between Mast",
    "Gradient Descent N",
    "Gradient Descent P",
    "IMP",
    "Line",
    "More Than 3mm per meter",
    "Next Loc",
    "Panto Height Next",
    "Panto Height Previous",
    "Previous Loc",
    "Relative Gradient Descent",
    "S No",
    "Section",
    "Speed (km/h)",
    "Stagger 1",
    "Stagger 2",
    "Stagger 3",
    "Stagger 4",
    "Stagger 5",
    "Taken At"
  ];
  const gradientHeaders = [
    "Distance Between Mast",
    "Gradient Descent N",
    "Gradient Descent P",
    "Greater Than 3mm per meter",
    "Line",
    "Location N",
    "Location P",
    "OHE Height N",
    "OHE Height P",
    "Relative Gradient Descent",
    "S No",
    "Section",
    "Speed (km/h)",
    "Taken At"
  ];
  
const SparkDataView = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [format, setFormat] = useState("text");
  const [reportType,setReportType] = useState("");
  const [fileType, setFileType] = useState("excel");
  const [data, setData] = useState([]); // State for storing API data
  const [selectedRows, setSelectedRows] = useState([]);

  const handleCheckboxChange = (id) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id) // Unselect row if already selected
        : [...prevSelected, id] // Select row if not already selected
    );
  };
   
  const handleDialogOpen =  (value) => {
    setReportType(value)
    setOpenDialog(true);

    
  };
  const handleDialogClose = () => setOpenDialog(false);
  const handleFormatChange = (event) => setFormat(event.target.value);
  const handleFileTypeChange = (event) => setFileType(event.target.value);
  const [page, setPage] = useState(0); // For pagination
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page
  const [anchorGradientEl, setAnchorGradientEl] = useState(null);
  const [anchorWireEl, setAnchorWireEl] = useState(null);
  const handleMenuGradientOpen = (event) => {
    setAnchorGradientEl(event.currentTarget);
  };

  const handleGraidentMenuClose = () => {
    setAnchorGradientEl(null);
  };

  const handleGradientOptionClick = (option) => {
    setReportType(option);
    handleGraidentMenuClose(); // Close the menu
    handleDialogOpen(option); // Pass the selected option
  };

  const handleMenuWireOpen = (event) => {
    setAnchorWireEl(event.currentTarget);
  };

  const handleWireMenuClose = () => {
    setAnchorWireEl(null);
  };

  const handleWireOptionClick = (option) => {
    handleWireMenuClose(); // Close the menu
    handleDialogOpen(option); // Pass the selected option
  };

  
  const handleGenerate = async () => {
    if(reportType === "Master Report"){
      generateMasterReport();
    } else{
      generateGraidentReport();
    }
  }

  const generateMasterReport = async () => {
    let result;
    try {
  
      const response = await fetch(`${apiUrl}/fetch_master_data`, {
        method: 'GET', // or 'POST' depending on your API
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      result = await response.json(); // parse the JSON from the response
      const csvRows = [masterReportHeaders.join(",")];
     
      result?.data?.forEach((item) => {
  
        const row = [
          item.Distance_Between_Mast || "-",     // Fallback to '-' if null
          item.Gradient_Descent_N || "-",
          item.Gradient_Descent_P || "-",
          item.IMP || "-",
          item.Line || "-",
          item.More_Than_3mm_per_meter || "-",
          item.Next_Loc || "-",
          item.Panto_Height_Next || "-",
          item.Panto_Height_Previous || "-",
          item.Previous_Loc || "-",
          item.Relative_Gradient_Descent || "-",
          item.S_No || "-",
          item.Section || "-",
          item.Speed_kmh || "-",
          item.Stagger_1 || "-",
          item.Stagger_2 || "-",
          item.Stagger_3 || "-",
          item.Stagger_4 || "-",
          item.Stagger_5 || "-",
          item.Taken_At || "-"
        ].join(",");
      
        csvRows.push(row);
      });
     
      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
  
      link.href = url;
      link.setAttribute("download", "master_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
     // setError(error.message);
    } finally {
     
  
      handleDialogClose(); // Close the dialog after download
    }
  }

  const generateGraidentReport = async () => {
    try {
      const response = await fetch(`${apiUrl}/fetch_gradient_data`, {
        method: 'GET', // or 'POST' depending on your API
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json(); // parse the JSON from the response
      const csvRows = [gradientHeaders.join(",")];
      
      result?.data?.forEach((item) => {
        const row = [
          item.Distance_Between_Mast || "-",          // Handle null or undefined values
          item.Gradient_Descent_N || "-",
          item.Gradient_Descent_P || "-",
          item.Greater_Than_3mm_per_meter || "-",
          item.Line || "-",
          item.Location_N || "-",
          item.Location_P || "-",
          item.OHE_Height_N || "-",
          item.OHE_Height_P || "-",
          item.Relative_Gradient_Descent || "-",
          item.S_No || "-",
          item.Section || "-",
          item.Speed_kmh || "-",
          item.Taken_At || "-"
        ].join(",");
       
        csvRows.push(row);
      });
      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
  
      link.href = url;
      link.setAttribute("download", "gradient_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
     // setError(error.message);
    } finally {
     // setLoading(false); // End loading
    }
  }
  const handleDownload = async () => {
    
      if (data.length === 0) {
        console.log("No data to download.");
        return;
      }

      const csvRows = [headers.join(",")];

      // Loop through data and convert each object to a CSV row
      data.forEach((item) => {
        const row = [
          item.id,
          item.route,
          item.section,
          item.cp1 || "-",
          item.cp2 || "-",
          item.cp3 || "-",
          item.cp4 || "-",
          item.cp5 || "-",
          item.feature_eng,
          item.feature_trd,
          item.frame_number,
          item.height,
          item.imp,
          item.inclination,
          item.pantograph_height,

          item.uplift_force,
        ].join(",");

        csvRows.push(row);
      });
  
      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
  
      link.href = url;
      link.setAttribute("download", "report_data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      handleDialogClose(); // Close the dialog after download
   

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
        `${apiUrl}/fetch-report-data`
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
            <Grid container spacing={2}>
              <Grid item  xs={3}>
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
              <Grid item  xs={3}>
                <TextField
                  label="Session"
                  variant="outlined"
                  fullWidth
                  sx={{ bgcolor: "#333", borderRadius: 1 }}
                />
              </Grid>
              <Grid item  xs={3}>
               <Button variant="contained">Generate</Button>
              </Grid>
            </Grid>

            <TableContainer
              component={Paper}
              sx={{ marginTop: 2, bgcolor: "#333",overflow:"auto",height:"30vh" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                  <TableCell>Select</TableCell> {/* Add header for the checkbox */}
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
                  
                   

                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.length > 0 ? (
                      data
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item) => (
                      <TableRow key={item.id}>
                         <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(item.id)}
                    onChange={() => handleCheckboxChange(item.id)}
                    color="primary"
                  />
                </TableCell>
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
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginRight: 2 }}
                >
                       <Typography style={{fontSize:"1vw"}}>Update Records</Typography>
                </Button>
                {/* <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleDownload}
                >
                  <Typography style={{fontSize:"1vw"}}>Download Report</Typography>
                </Button> */}
              </Box>
            </Box>
          </Paper>
        
         
        </Grid>
      

        <Grid item  xs={4}>
          <Card sx={{ bgcolor: "#333", color: "#00E5FF" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 2,
                }}
              >
                <PhotoCamera sx={{ fontSize: 200 }} />
              </Box>
             
            </CardContent>
          </Card>
        </Grid>
      </Grid>
 
  <Grid container spacing={2} sx={{ marginTop: 3 }}>
    {/* First Row */}
    {/* <Grid item xs={1}>
      <Button onClick={handleDialogOpen} variant="contained" fullWidth>
        <Typography style={{fontSize:"1vw"}}>OHE Height</Typography>
    
      </Button>
    </Grid> */}
    <Grid item xs={3}>
      <Button onClick={() => handleDialogOpen("Master Report")} variant="contained" fullWidth>
      <Typography style={{fontSize:"1vw"}}>Master Report</Typography>
      </Button>
    </Grid>
    {/* <Grid item xs={1}>
      <Button onClick={handleDialogOpen} variant="contained" fullWidth>
      <Typography style={{fontSize:"1vw"}}>CP</Typography>
      </Button>
    </Grid> */}

    {/* Second Row */}
    <Grid item xs={3}>
      <Button onClick={handleMenuGradientOpen} variant="contained" fullWidth>
      <Typography style={{fontSize:"1vw"}}>Gradient</Typography>
      </Button>

      <Menu
        anchorEl={anchorGradientEl}
        open={Boolean(anchorGradientEl)}
        onClose={handleGraidentMenuClose}
      >
        <MenuItem onClick={() => handleGradientOptionClick('Gradient - Descent & Relative Descent')}>
          Gradient - Descent & Relative Descent
        </MenuItem>
        <MenuItem onClick={() => handleGradientOptionClick('3MM')}>
          Graident Descent {">"} 3MM
        </MenuItem>
      </Menu>
    </Grid>
    {/* <Grid item xs={1}>
      <Button onClick={handleDialogOpen} variant="contained" fullWidth>
      <Typography style={{fontSize:"1vw"}}>IOL</Typography>
      </Button>
    </Grid> */}

    {/* Third Row */}
    {/* <Grid item xs={1}>
      <Button onClick={handleDialogOpen} variant="contained" fullWidth>
      <Typography style={{fontSize:"1vw"}}>UIOL</Typography>
      </Button>
    </Grid> */}
    {/* <Grid item xs={1}>
      <Button onClick={handleDialogOpen} variant="contained" fullWidth>
      <Typography style={{fontSize:"1vw"}}>X/0 & T/0</Typography>
      </Button>
    </Grid> */}

    {/* Fourth Row */}
    {/* <Grid item xs={1}>
      <Button onClick={handleDialogOpen} variant="contained" fullWidth>
      <Typography style={{fontSize:"1vw"}}>All Data</Typography>
      </Button>
    </Grid> */}
    {/* <Grid item xs={1}>
      <Button onClick={handleMenuWireOpen} variant="contained" fullWidth>
      <Typography style={{fontSize:"1vw"}}>Wire condition</Typography>
      </Button>

      <Menu
        anchorEl={anchorWireEl}
        open={Boolean(anchorWireEl)}
        onClose={handleWireMenuClose}
      >
        <MenuItem onClick={() => handleWireOptionClick('Pantograph Flip')}>
          Pantograph Flip
        </MenuItem>
        <MenuItem onClick={() => handleWireOptionClick('Bird Strikes')}>
          Bird Strikes
        </MenuItem>
        <MenuItem onClick={() => handleWireOptionClick('Insufficient OHL Tension')}>
          Insufficient OHL Tension
        </MenuItem>
        <MenuItem onClick={() => handleWireOptionClick('Bird Nest or any hanging clothes or foreign particle')}>
          Bird Nest or any hanging clothes or foreign particle
        </MenuItem>
        <MenuItem onClick={() => handleWireOptionClick('Kinks, Twist, Damaged strands of catenary')}>
          Kinks, Twist, Damaged strands of catenary
        </MenuItem>
        <MenuItem onClick={() => handleWireOptionClick('PG Clamps & Jumpers')}>
          PG Clamps & Jumpers
        </MenuItem>
        <MenuItem onClick={() => handleWireOptionClick('Damaged Droppers')}>
          Damaged Droppers
        </MenuItem>
      </Menu>
    </Grid> */}

    {/* Fifth Row */}
    {/* <Grid item xs={1}>
      <Button onClick={handleDialogOpen} variant="contained" fullWidth>
      <Typography style={{fontSize:"1vw"}}>Insulator</Typography>
      </Button>
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
          <Button onClick={handleGenerate}>Download</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SparkDataView;
