import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Checkbox,
} from "@mui/material";
import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;
const GPSSettings = () => {
  const [gpsPort, setGpsPort] = useState("");
  const [baudRate, setBaudRate] = useState("9600");
  const [dataBit, setDataBit] = useState("8");
  const [stopBit, setStopBit] = useState("0");
  const [parityBit, setParityBit] = useState("1");
  const [isChecked, setIsChecked] = useState(true);
  const [availablePorts, setAvailablePorts] = useState([]);
  
  useEffect(() => {
    getDevices();
  }, []);

  const getDevices = async () => {
    try {
      const response = await axios.get(`${apiUrl}/list-gps-devices`);
      setAvailablePorts(response.data.GPS_Devices);
    } catch (err) {}
  };

 
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


  const handleSaveSettings = () => {
    localStorage.setItem("gps_port",gpsPort);
    alert("GPS settings saved")
    // You can handle saving the GPS settings here (e.g., send them to the backend or apply them)
    console.log({
      gpsPort,
      baudRate,
      dataBit,
      stopBit,
      parityBit,
    });
  };

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#333",
        height: "100vh",
        paddingTop: 10,
      }}
    >
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
              color: "#00E5FF",
              marginRight: 1,
              "&.Mui-checked": {
                color: "#00E5FF",
              },
            }}
          />
          <Typography
            variant="h4"
            sx={{ textAlign: "center", flexGrow: 1, fontWeight: "bold" }}
            color="#00E5FF"
          >
            GPS Settings
          </Typography>
        </Box>

        {/* GPS Port Select */}
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
            
            {availablePorts.map((port, index) => (
              <MenuItem key={index} value={port.name}>
                {port.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* Form Fields for GPS Settings */}
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

        <Button
          variant="contained"
          fullWidth
          sx={{ background: "#00E5FF", color: "black", fontWeight: "800" }}
          onClick={handleSaveSettings}
        >
          Save GPS Settings
        </Button>
      </Box>
    </Box>
  );
};

export default GPSSettings;
