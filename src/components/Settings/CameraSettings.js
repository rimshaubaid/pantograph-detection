import React, { useEffect, useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { VideocamOff } from '@mui/icons-material';

const CameraSettings = () => {
  const [camera, setCamera] = useState('');
  const [resolution, setResolution] = useState('');
  const [cameras, setCameras] = useState([]);
  const [videoStream, setVideoStream] = useState(null);

  useEffect(() => {
    // Fetch the list of connected cameras
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setCameras(videoDevices);
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    };

    getCameras();
  }, []);

  useEffect(() => {
    // Fetch the resolution when a camera is selected
    const getResolution = async () => {
      if (camera) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: camera }
          });
          const videoTrack = stream.getVideoTracks()[0];
          const settings = videoTrack.getSettings();

          // Automatically set the resolution based on camera settings
          if (settings.width && settings.height) {
            const resolutionLabel = `${settings.height}p`;
            setResolution(resolutionLabel);
          }
          
          setVideoStream(stream);  // Set the video stream for live video
        } catch (error) {
          console.error('Error accessing camera stream.', error);
        }
      } else {
        setResolution('');
        setVideoStream(null);
      }
    };

    getResolution();

    // Cleanup video stream when component unmounts or camera changes
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [camera]);

  const handleCameraChange = (event) => {
    setCamera(event.target.value);
  };

  const handleResolutionChange = (event) => {
    setResolution(event.target.value);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#333',
        color: '#fff',
        padding: '20px',
        paddingTop: 10
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: 4, fontWeight: 'bold', color: '#00E5FF' }}>
        Camera Settings
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 4,
        }}
      >
        <FormControl sx={{ minWidth: 150, marginRight: 2 }}>
          <InputLabel id="camera-select-label" sx={{ color: '#00E5FF', fontWeight: 'bold' }}>Camera</InputLabel>
          <Select
            labelId="camera-select-label"
            id="camera-select"
            value={camera}
            label="Camera"
            onChange={handleCameraChange}
            sx={{ color: '#fff', fontWeight: 'bold' }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {cameras.map((cam) => (
              <MenuItem key={cam.deviceId} value={cam.deviceId}>
                {cam.label || `Camera ${cameras.indexOf(cam) + 1}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 150, marginRight: 2 }}>
          <InputLabel id="resolution-select-label" sx={{ color: '#00E5FF', fontWeight: 'bold' }}>Resolution</InputLabel>
          <Select
            labelId="resolution-select-label"
            id="resolution-select"
            value={resolution}
            label="Resolution"
            onChange={handleResolutionChange}
            sx={{ color: '#fff', fontWeight: 'bold' }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="720p">720p</MenuItem>
            <MenuItem value="1080p">1080p</MenuItem>
            <MenuItem value="1440p">1440p</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" sx={{ marginRight: 2, fontWeight: 'bold' }}>
          Advance Setting
        </Button>
        <Button variant="contained" color="secondary" sx={{ fontWeight: 'bold' }}>
          Save Camera Setting
        </Button>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
          width: '80%',
          height: '50vh',
          borderRadius: '4px',
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
              width: '100%',
              height: '100%',
              borderRadius: '4px',
              objectFit: 'cover',
            }}
          />
        ) : (
          <>
            <VideocamOff sx={{ fontSize: 100, color: '#00E5FF' }} />
            <Typography variant="h6" sx={{ color: '#00E5FF', fontWeight: 'bold' }}>
              There is no connected camera.
            </Typography>
          </>
        )}
      </Box>
      <Button variant="contained" color="primary" sx={{ background: "#00E5FF", color: "black", fontWeight: "800", marginTop: 5 }}>
        Save Camera Setting
      </Button>
    </Box>
  );
};

export default CameraSettings;
