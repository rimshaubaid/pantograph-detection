import React, { useState, useEffect } from 'react';
import { Slider, Box, Typography, Button } from '@mui/material';

const CameraAdvancedSettings = ({ videoStream }) => {
  const [frameRate, setFrameRate] = useState(30);
  const [zoom, setZoom] = useState(1);
  const [focusMode, setFocusMode] = useState('auto');
  const [brightness, setBrightness] = useState(0);

  useEffect(() => {
    if (videoStream) {
      const videoTrack = videoStream.getVideoTracks()[0];
      const capabilities = videoTrack.getCapabilities();

      // Set default zoom, brightness, etc. if supported
      if (capabilities.zoom) setZoom(capabilities.zoom.min);
      if (capabilities.brightness) setBrightness(capabilities.brightness.min);
    }
  }, [videoStream]);

  const applyFrameRate = async (newFrameRate) => {
    setFrameRate(newFrameRate);
    if (videoStream) {
      const videoTrack = videoStream.getVideoTracks()[0];
      await videoTrack.applyConstraints({
        frameRate: newFrameRate,
      });
     // console.log('hereeee')
    }
  };

  const applyZoom = async (newZoom) => {
    setZoom(newZoom);
    try{
        if (videoStream) {
            const videoTrack = videoStream.getVideoTracks()[0];
            await videoTrack.applyConstraints({
              advanced: [{ zoom: newZoom }],
            });
          }
    }catch(err){
        alert(err);
    }
   
  };

  const applyFocusMode = async (mode) => {
    setFocusMode(mode);
    try{
        if (videoStream) {
            const videoTrack = videoStream.getVideoTracks()[0];
            await videoTrack.applyConstraints({
              advanced: [{ focusMode: mode }],
            });
          }
    }catch(err){
        alert(err);
    }
   
  };

  const applyBrightness = async (newBrightness) => {
    setBrightness(newBrightness);
    try{
        if (videoStream) {
            const videoTrack = videoStream.getVideoTracks()[0];
            await videoTrack.applyConstraints({
              advanced: [{ brightness: newBrightness }],
            });
          }
    }catch(err){

    }
   
  };

  return (
    <Box>
     

      {/* Frame Rate */}
      <Typography>Frame Rate: {frameRate} FPS</Typography>
      <Slider
        value={frameRate}
        min={1}
        max={60}
        step={1}
        onChange={(e, val) => applyFrameRate(val)}
        sx={{ width: 300 }}
      />

      {/* Zoom */}
      <Typography>Zoom: {zoom.toFixed(2)}x</Typography>
      <Slider
        value={zoom}
        min={1}
        max={5} // Assume 5x zoom for example
        step={0.1}
        onChange={(e, val) => applyZoom(val)}
        sx={{ width: 300 }}
      />

      {/* Focus Mode */}
      <Typography>Focus Mode</Typography>
      <Button
        variant={focusMode === 'auto' ? 'contained' : 'outlined'}
        onClick={() => applyFocusMode('auto')}
      >
        Auto Focus
      </Button>
      <Button
        variant={focusMode === 'manual' ? 'contained' : 'outlined'}
        onClick={() => applyFocusMode('manual')}
      >
        Manual Focus
      </Button>

      {/* Brightness */}
      <Typography>Brightness: {brightness}</Typography>
      <Slider
        value={brightness}
        min={-1}
        max={1}
        step={0.1}
        onChange={(e, val) => applyBrightness(val)}
        sx={{ width: 300 }}
      />
    </Box>
  );
};

export default CameraAdvancedSettings;
