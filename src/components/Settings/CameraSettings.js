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
  const [settings, setSettings] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
  });

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
    const selectedCameraId = event.target.value;
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
      console.log('cap',capabilities)
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

  // Handle advanced settings (e.g., brightness, contrast)
  // const handleAdvancedSettingChange = (event, newValue, setting) => {
  //   setSettings((prevSettings) => ({
  //     ...prevSettings,
  //     [setting]: newValue,
  //   }));

  //   if (videoStream) {
  //     const videoTrack = videoStream.getVideoTracks()[0];
      
  //     videoTrack.applyConstraints({
  //       advanced: [{ [setting]: newValue / 100 }],
  //     });
  //   }
  // };

  const save = () => {
    localStorage.setItem("resolution", resolution);
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
            {cameras.map((cam) => (
              <MenuItem key={cam.deviceId} value={cam.deviceId}>
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
      
      {/* Advanced Settings Accordion */}
      {/* <Accordion sx={{ width: "80%", marginBottom: 4 }}>
        <AccordionSummary
          expandIcon={<ExpandMore sx={{ color: "#00E5FF" }} />}
          aria-controls="advanced-settings-content"
          id="advanced-settings-header"
        >
          <Typography sx={{ color: "#00E5FF", fontWeight: "bold" }}>
            Advanced Settings
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6" sx={{ color: "#fff" }}>
              Brightness
            </Typography>
            <Slider
              value={settings.brightness}
              onChange={(e, newValue) =>
                handleAdvancedSettingChange(e, newValue, "brightness")
              }
              aria-labelledby="brightness-slider"
              min={0}
              max={200}
              sx={{ color: "#00E5FF" }}
            />
            <Typography variant="h6" sx={{ color: "#fff" }}>
              Contrast
            </Typography>
            <Slider
              value={settings.contrast}
              onChange={(e, newValue) =>
                handleAdvancedSettingChange(e, newValue, "contrast")
              }
              aria-labelledby="contrast-slider"
              min={0}
              max={200}
              sx={{ color: "#00E5FF" }}
            />
            <Typography variant="h6" sx={{ color: "#fff" }}>
              Saturation
            </Typography>
            <Slider
              value={settings.saturation}
              onChange={(e, newValue) =>
                handleAdvancedSettingChange(e, newValue, "saturation")
              }
              aria-labelledby="saturation-slider"
              min={0}
              max={200}
              sx={{ color: "#00E5FF" }}
            />
          </Box>
        </AccordionDetails>
      </Accordion> */}

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
