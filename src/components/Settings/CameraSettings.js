import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { VideocamOff } from "@mui/icons-material";
import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;
const CameraSettings = () => {
  const [cameras, setCameras] = useState([]);
  const [camera, setCamera] = useState("");
  const [resolution, setResolution] = useState("");

  const [videoStream, setVideoStream] = useState(null);

  const [availableResolutions, setAvailableResolutions] = useState([]);
 
  // Fetch the list of connected cameras
  useEffect(() => {
    // Fetch the list of connected cameras
    const getCameras = async () => {
      try {
        const response = await axios.get(`${apiUrl}/list-cameras`);
    
        setCameras(response.data.cameras);
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    };

    getCameras();
  }, []);
 
  const handleCameraChange = async (event) => {
    const selectedCamera = cameras.find(
      (cam) => cam.camera_type === event.target.value
    );

    setCamera(event.target.value);
    // const deviceId = await getDeviceIdByName(event.target.value);

    if (selectedCamera) {
      const resolutions = selectedCamera.resolution
        ? [selectedCamera.resolution]
        : [];
      setAvailableResolutions(resolutions);
    } else {
      setAvailableResolutions([]);
    }

    // Stop any existing stream
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
    }

    // Start new video stream from selected camera
    if (selectedCamera) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: event.target.value } },
        });
        setVideoStream(stream);
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    }
  };
  const handleResolutionChange = (event) => {
    setResolution(event.target.value);
  };

  const save = () => {
    localStorage.setItem("resolution", resolution);
    localStorage.setItem("camera_type", camera);
    alert("Camera settings saved")
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
        variant="h4"
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
          marginBottom: 4,
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
              <MenuItem key={cam.camera_type} value={cam.camera_type}>
                {cam.camera_type || `Camera ${cameras.indexOf(cam) + 1}`}
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
            
            <MenuItem value={availableResolutions}>
              {availableResolutions}
            </MenuItem>
            {/* <MenuItem value="1080p">1080p</MenuItem>
            <MenuItem value="1440p">1440p</MenuItem> */}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginRight: 2, fontWeight: "bold" }}
        >
          Advance Setting
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
          height: "50vh",
          borderRadius: "4px",
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
              borderRadius: "4px",
              objectFit: "cover",
            }}
          />
        ) : (
          <>
            <VideocamOff sx={{ fontSize: 100, color: "#00E5FF" }} />
            <Typography
              variant="h6"
              sx={{ color: "#00E5FF", fontWeight: "bold" }}
            >
              There is no connected camera.
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
};

export default CameraSettings;
