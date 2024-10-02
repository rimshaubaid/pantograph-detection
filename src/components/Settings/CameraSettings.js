import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import CameraAdvancedSettings from "./AdvancedSettings.js";
import { VideocamOff, ExpandMore } from "@mui/icons-material";
import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;
const CameraSettings = () => {
  const [cameras, setCameras] = useState([]);
  const [camera, setCamera] = useState("");
  const [camName, setCamName] = useState("");
  const [resolution, setResolution] = useState("");
  const [availableResolutions, setAvailableResolutions] = useState([]);
  const [videoStream, setVideoStream] = useState(null);
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
  const [integerId, setIntegerId] = useState(0);
  // Function to handle opening the advanced settings dialog
  const handleOpenSettingsDialog = () => {
    setOpenSettingsDialog(true);
  };

  // Function to handle closing the advanced settings dialog
  const handleCloseSettingsDialog = () => {
    setOpenSettingsDialog(false);
  };

  //   useEffect(() => {
  //   // Fetch the list of connected cameras
  //   const getCameras = async () => {
  //     try {
  //       const response = await axios.get(`${apiUrl}/list-cameras`);
  //       setCameras(response.data.cameras);
  //     } catch (error) {
  //       console.error("Error accessing media devices.", error);
  //     }
  //   };

  //   getCameras();
  // }, []);
  useEffect(() => {
    const getCameras = async () => {
      try {
        // Request camera/microphone permission
        // Request camera/microphone permission
      await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
    

        // Once permission is granted, you can enumerate devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        // console.log('Devices:', devices);

        // Filter out only the video input devices (cameras)
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setCameras(videoDevices);
      } catch (error) {
        console.error("Error fetching camera devices.", error);
      }
    };

    getCameras();

    return () => {
      releaseCamera();
    };
  }, []);
  const releaseCamera = async () => {
    try {
      
      await axios.post(`${apiUrl}/release-camera`);
    } catch (err) {}
  };
 // Cleanup function to stop the video stream on component unmount
 useEffect(() => {
  return () => {

    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
    }
  };
}, [videoStream]);
  const handleCameraChange = async (event) => {
    const selectedCameraId = event.target.value;
    const selectedIndex = cameras.findIndex(
      (cam) => cam.deviceId === selectedCameraId
    ); // Get the index of the selected camera

    setIntegerId(selectedIndex);
    setCamera(selectedCameraId);
    const response = await getCameraResolutions(selectedIndex);
    if(response){
      setAvailableResolutions(response)
    }

  
  };

  const getCameraResolutions = async (cameraIndex) => {
    try {
      const response = await axios.get(`${apiUrl}/get_resolutions`, {
        params: { camera_index: cameraIndex },
      });
  
 
      
      // Transform working_resolutions into an array of objects
      const resolutions = response.data.working_resolutions.map(resolution => {
        const width = resolution[0];
        const height = resolution[1];
        const label = `${width}x${height}`; // Format as '640x480'
  
        return { width, height, label }; // Return as an object
      });
  
      return resolutions; // Return the array of resolution objects
    } catch (error) {
      console.error('Error fetching camera resolutions:', error);
      return []; // Return an empty array in case of an error
    }
  };
  
  

  const handleResolutionChange = async (event) => {
    const selectedResolution = availableResolutions.find(
      (res) => res.label === event.target.value
    );
    setResolution(event.target.value);

    if (camera && selectedResolution) {
     //console.log('cca',camera,selectedResolution)
      // Stop the current stream before changing resolution
      if (videoStream) {xw
        videoStream.getTracks().forEach((track) => track.stop());
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: camera },
            width: { exact: selectedResolution.width },
            height: { exact: selectedResolution.height },
          },
        });
        setVideoStream(stream);
      } catch (error) {
        console.error("Error changing resolution:", error);
      }
    }
  };

  const save = () => {
    if (!camera) {
      alert("Select camera");
      return;
    }
    if (!resolution) {
      alert("Select resolution");
      return;
    }

    localStorage.setItem("resolution", resolution);
    localStorage.setItem("deviceId", integerId);
    localStorage.setItem("camera_type", camera);
    alert("Camera settings saved");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#333",
        color: "#fff",
        padding: "20px",
        paddingTop: 10,
      }}
    >
      <Typography
        variant="h6"
        sx={{ marginBottom: 4, fontWeight: "bold", color: "#00E5FF" }}
      >
        Camera Settings
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 1,
        }}
      >
        <FormControl sx={{ minWidth: 150, marginRight: 2 }}>
          <InputLabel
            id="camera-select-label"
            sx={{ color: "#00E5FF", fontWeight: "bold" }}
          >
            Camera
          </InputLabel>
          <Select
            labelId="camera-select-label"
            id="camera-select"
            value={camera}
            label="Camera"
            onChange={handleCameraChange}
            sx={{ color: "#fff", fontWeight: "bold" }}
          >
            {cameras.map((cam, index) => (
              <MenuItem
                key={index}
                value={cam.deviceId} // Value should be deviceId
                data-index={index}
              >
                {cam.label || `Camera ${cameras.indexOf(cam) + 1}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 150, marginRight: 2 }}>
          <InputLabel
            id="resolution-select-label"
            sx={{ color: "#00E5FF", fontWeight: "bold" }}
          >
            Resolution
          </InputLabel>
          <Select
            labelId="resolution-select-label"
            id="resolution-select"
            value={resolution}
            label="Resolution"
            onChange={handleResolutionChange}
            sx={{ color: "#fff", fontWeight: "bold" }}
          >
            {availableResolutions.map((res) => (
              <MenuItem key={res.label} value={res.label}>
                {res.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={handleOpenSettingsDialog}
          sx={{ marginRight: 3 }}
        >
          Advanced Settings
        </Button>
        <Button
          variant="contained"
          color="secondary"
          sx={{ fontWeight: "bold" }}
          onClick={save}
        >
          Save Camera Setting
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000",
          width: "80%",
          height: "500px",
          maxWidth: "100%",
          maxHeight: "100%",
          borderRadius: "4px",
          position: "relative",
        }}
      >
        {camera && videoStream ? (
          <video
            autoPlay
            playsInline
            ref={(videoElement) => {
              if (videoElement) {
                videoElement.srcObject = videoStream;
              }
            }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain", // Ensure aspect ratio is maintained
            }}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <VideocamOff sx={{ color: "#00E5FF", fontSize: 80 }} />
            <Typography variant="h5" sx={{ color: "#fff" }}>
              No Camera Selected
            </Typography>
          </Box>
        )}
      </Box>
      {/* Dialog for Advanced Settings */}
      <Dialog
        open={openSettingsDialog}
        onClose={handleCloseSettingsDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Advanced Camera Settings</DialogTitle>
        <DialogContent>
          {/* Pass the videoStream to the CameraAdvancedSettings component */}
          <CameraAdvancedSettings videoStream={videoStream} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CameraSettings;
