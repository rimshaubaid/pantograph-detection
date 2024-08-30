import React from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Checkbox,
  TextField,
  Typography,
} from "@mui/material";

const TechoSensor = () => {
  const [Port, setPort] = React.useState("");
  const [baudRate, setBaudRate] = React.useState("9600");
  const [isChecked, setIsChecked] = React.useState(false);
  const handlePortChange = (event) => {
    setPort(event.target.value);
  };

  const handleBaudRateChange = (event) => {
    setBaudRate(event.target.value);
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
            Tacho Sensor Settings
          </Typography>
        </Box>
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel id="gps-port-select-label" sx={{ color: "#fff" }}>
            Port
          </InputLabel>
          <Select
            labelId="gps-port-select-label"
            id="gps-port-select"
            value={Port}
            label="Port"
            onChange={handlePortChange}
            sx={{ color: "#fff" }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>PORT1</MenuItem>
            <MenuItem value={20}>PORT2</MenuItem>
            <MenuItem value={30}>PORT3</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel id="baud-rate-select-label" sx={{ color: "#fff" }}>
            Baud Rate
          </InputLabel>
          <Select
            labelId="baud-rate-select-label"
            id="baud-rate-select"
            value={baudRate}
            label="Baud Rate"
            onChange={handleBaudRateChange}
            sx={{ color: "#fff" }}
          >
            <MenuItem value="9600">9600</MenuItem>
            <MenuItem value="19200">19200</MenuItem>
            <MenuItem value="38400">38400</MenuItem>
            <MenuItem value="57600">57600</MenuItem>
            <MenuItem value="115200">115200</MenuItem>
          </Select>
        </FormControl>
       
        <Button variant="contained" color="primary" fullWidth sx={{background:"#00E5FF",color:"black",fontWeight:"800"}}>
          Save Tacho Sensor Setting
        </Button>
      </Box>
    </Box>
  );
};

export default TechoSensor;
