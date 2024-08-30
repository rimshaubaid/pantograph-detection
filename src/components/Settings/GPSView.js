import React from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Checkbox
} from "@mui/material";

const GPSSettings = () => {
  const [gpsPort, setGpsPort] = React.useState("");
  const [baudRate, setBaudRate] = React.useState("9600");
  const [dataBit, setDataBit] = React.useState("8");
  const [stopBit, setStopBit] = React.useState("0");
  const [parityBit, setParityBit] = React.useState("1");
  const [isChecked, setIsChecked] = React.useState(true);
  const handleGpsPortChange = (event) => {
    setGpsPort(event.target.value);
  };

  const handleBaudRateChange = (event) => {
    setBaudRate(event.target.value);
  };

  const handleDataBitChange = (event) => {
    setDataBit(event.target.value);
  };

  const handleStopBitChange = (event) => {
    setStopBit(event.target.value);
  };

  const handleParityBitChange = (event) => {
    setParityBit(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  return (
    <Box sx={{ width: "100%", backgroundColor: "#333", height:"100vh"}}>
      <Box
        sx={{
          width: "100%",
          maxWidth: "400px",
          margin: "auto",
          padding: "20px",

          color: "#fff",
          borderRadius: "4px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
          <Checkbox
            checked={isChecked}
            onChange={handleCheckboxChange}
            sx={{
              color: '#00E5FF',
              marginRight: 1,
              '&.Mui-checked': {
                color: '#00E5FF',
              },
            }}
          />
          <Typography variant="h4" sx={{ textAlign: "center", flexGrow: 1,fontWeight: 'bold', }} color="#00E5FF">
            GPS Settings
          </Typography>
        </Box>
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel id="gps-port-select-label" sx={{ color: "#fff" }}>
            GPS Com Port
          </InputLabel>
          <Select
            labelId="gps-port-select-label"
            id="gps-port-select"
            value={gpsPort}
            label="GPS Com Port"
            onChange={handleGpsPortChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>COM1</MenuItem>
            <MenuItem value={20}>COM2</MenuItem>
            <MenuItem value={30}>COM3</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Baud Rate"
          type="number"
          fullWidth
          value={baudRate}
          onChange={handleBaudRateChange}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Data Bit"
          type="number"
          fullWidth
          value={dataBit}
          onChange={handleDataBitChange}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Stop Bit"
          type="number"
          fullWidth
          value={stopBit}
          onChange={handleStopBitChange}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Parity Bit"
          type="number"
          fullWidth
          value={parityBit}
          onChange={handleParityBitChange}
          sx={{ marginBottom: 4 }}
        />
        <Button variant="contained" color="primary" fullWidth sx={{background:"#00E5FF",color:"black",fontWeight:"800"}}>
          Save GPS Setting
        </Button>
      </Box>
    </Box>
  );
};

export default GPSSettings;
