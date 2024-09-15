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
  DialogTitle
} from "@mui/material";
import CameraAdvancedSettings from "./AdvancedSettings.js";
import { VideocamOff , ExpandMore } from "@mui/icons-material";

const CameraSettings = () => {
  const [cameras, setCameras] = useState([]);
  const [camera, setCamera] = useState("");
  const [resolution, setResolution] = useState("");
  const [availableResolutions, setAvailableResolutions] = useState([]);
  const [videoStream, setVideoStream] = useState(null);
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
  const [integerId,setIntegerId] = useState(0);
  // Function to handle opening the advanced settings dialog
  const handleOpenSettingsDialog = () => {
    setOpenSettingsDialog(true);
  };

  // Function to handle closing the advanced settings dialog
  const handleCloseSettingsDialog = () => {
    setOpenSettingsDialog(false);
  };
  // Fetch the list of connected cameras
  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((device) => device.kind === "videoinput");
        setCameras(videoDevices);
      } catch (error) {
        console.error("Error fetching camera devices.", error);
      }
    };
    getCameras();
  }, []);

  const handleCameraChange = async (event) => {
  
    const selectedIndex = event.target.value; // Get the index of the selected camera
   
    const selectedCameraId = cameras[selectedIndex].deviceId;
  
    setIntegerId(`camera${selectedIndex}`);
    setCamera(selectedCameraId);
 
    // Stop any existing video stream
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: selectedCameraId } },
      });
      setVideoStream(stream);

      // Get the video track from the stream and its capabilities
      const videoTrack = stream.getVideoTracks()[0];
      const capabilities = videoTrack.getCapabilities();

      // Extract supported resolutions from capabilities
      const { width, height } = capabilities;
      if (width && height) {
        const resolutions = [];
        for (let i = 0; i < width.max; i += 320) {
          resolutions.push({
            width: width.min + i,
            height: height.min + Math.floor((i * height.max) / width.max),
            label: `${width.min + i}x${height.min + Math.floor((i * height.max) / width.max)}`,
          });
        }
        setAvailableResolutions(resolutions);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const handleResolutionChange = async (event) => {
    const selectedResolution = availableResolutions.find(
      (res) => res.label === event.target.value
    );
    setResolution(event.target.value);

    if (camera && selectedResolution) {
      // Stop the current stream before changing resolution
      if (videoStream) {
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
    localStorage.setItem("resolution", resolution);
    localStorage.setItem("deviceId",integerId)
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
            {cameras.map((cam,index) => (
              <MenuItem key={cam.deviceId} value={index}>
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
        <Button variant="contained" onClick={handleOpenSettingsDialog} sx={{marginRight:3}}>
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
       <Dialog open={openSettingsDialog} onClose={handleCloseSettingsDialog} maxWidth="md" fullWidth>
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
