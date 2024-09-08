import React, { useEffect, useState,useRef } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Switch,
  Divider,
  Slider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import {
  Fullscreen,
  FullscreenExit,
  CameraAlt,
  VideoCameraBack,
  FiberManualRecord,
  Pause,
  AccessTime,
  DirectionsWalk,
  Satellite,
  Explore,
  Height,LocationOn,Straighten,
  FlashOn,
  VideocamOff,SwapHoriz
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import axios from "axios";
const CameraView = () => {
  const navigate = useNavigate();
  const [cameraError, setCameraError] = useState(null);
  const [isNightMode, setIsNightMode] = useState(true);
  const [isGPS, setIsGPS] = useState(true);
  const [openModal, setOpenModal] = useState(true);
  const [formValues, setFormValues] = useState({
    trainNo: "", // Added trainNo for the Train/Loco No text field
    route: "",
    line: "", // Added line for the Line dropdown
    crew: "",
    associatingStaff: "",
    pantographModel: "",
    typeOfOHE: "",
    sag: "",
    tensionInWire: "",
    weather: "",
    temperature: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isRecording, setIsRecording] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [openPauseDialog, setOpenPauseDialog] = useState(false);
  const [openResumeDialog, setOpenResumeDialog] = useState(false);
  const [openNavigateDialog, setOpenNavigateDialog] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
 // const [loading,setLoading] = useState()
  const [frames, setFrames] = useState([]);
  const [contactPoints,setContactPoints] = useState(null);
  const [height,setHeight] = useState(null);

  // useEffect(() => {
  //   const fetchFrames = async () => {
  //    // setIsLoading(true);
  
     
  
  //     try {
  //       const response = await fetch("http://81.208.170.168:5100/process-camera-feed", {
  //         method: "POST",
  //        // body: formData,
  //       });
  
  //       if (!response.body) {
  //         throw new Error("ReadableStream not supported or no body in response");
  //       }
  
  //       const reader = response.body.getReader();
  //       const decoder = new TextDecoder();
  //       let buffer = '';
  
  //       // Process the stream
  //       while (true) {
  //         const { done, value } = await reader.read();
  //         if (done) break;
  
  //         buffer += decoder.decode(value, { stream: true });
  //        // console.log('buffer',buffer)
  //         // Split buffer by newlines to get frames
  //         const frames = buffer.split('\n');
  //         buffer = frames.pop(); // Keep any incomplete frame in buffer
  
  //         frames.forEach(frame => {
  //           if (frame) setFrames(frame); // Update state with new frame
  //         });
  //       }
  
  //      // setIsLoading(false);
  
  //     } catch (error) {
  //       console.error('Error processing video:', error);
  //      // setIsLoading(false);
  //     }
  //   };
   

  //   fetchFrames();
  // }, []);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isRecording && !isPaused) {
        event.preventDefault();
        event.returnValue = ""; // Standard way to show the browser's confirmation dialog
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isRecording, isPaused]);

  const handleNavigationAttempt = () => {
    if (isRecording && !isPaused) {
      setOpenNavigateDialog(true);
    } else {
      navigate("/");
    }
  };

  const handleFullScreenToggle = () => {
    const videoContainer = document.getElementById("videoContainer");
    if (!isFullScreen) {
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
      } else if (videoContainer.mozRequestFullScreen) {
        videoContainer.mozRequestFullScreen();
      } else if (videoContainer.webkitRequestFullscreen) {
        videoContainer.webkitRequestFullscreen();
      } else if (videoContainer.msRequestFullscreen) {
        videoContainer.msRequestFullscreen();
      }
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullScreen(false);
    }
  };
  const handleStartRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
  };

  const handlePauseRecording = () => {
    setOpenPauseDialog(true);
  
  };

  const handleResumeRecording = () => {
    setOpenResumeDialog(true);
  };

  const confirmPause = () => {
    setIsPaused(true);
    setOpenPauseDialog(false);
  };

  const confirmResume = () => {
    setIsPaused(false);
    setOpenResumeDialog(false);
  };

  const confirmNavigation = () => {
    setIsPaused(true);
    setOpenNavigateDialog(false);
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const captureFrame = async () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64Image = canvas.toDataURL("image/jpeg");

      // Remove the prefix from base64 string
      const base64Data = base64Image.replace(/^data:image\/jpeg;base64,/, "");
      let framesArray = [];
      // // Send base64 frame to backend
      try {
        const response = await fetch(
          "http://127.0.0.1:5000/process-camera-feed",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json", // Set content type as JSON
            },
            body: JSON.stringify({ frame: base64Data }), // Serialize the body
          }
        );
       
        if (!response.body) {
          throw new Error(
            "ReadableStream not supported or no body in response"
          );
        }

        const reader = response.body.getReader();
      
        const decoder = new TextDecoder();
        let buffer = "";
   
        // Process the stream
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
 
          buffer += decoder.decode(value, { stream: true });
          // console.log('buffer',buffer)
          // Split buffer by newlines to get frames
          const frames = buffer.split("\n");
          buffer = frames.pop(); // Keep any incomplete frame in buffer

          frames.forEach((frame) => {
            if (frame) {
              try {
                const parsedFrame = JSON.parse(frame); // Parse the frame as JSON
                if (parsedFrame.processed_frame) {
                  framesArray.push(parsedFrame.processed_frame);
                  setFrames(parsedFrame.processed_frame); // Update state with new frame
                  setContactPoints(parsedFrame?.contact_points);
                  setHeight(parsedFrame?.pantograph_height);
                }
              } catch (error) {
                console.error("Error parsing frame:", error);
              }
            }
          });
        }
      } catch (error) {
        console.error("Error sending frame to backend:", error);
      }
    }
  };
  //console.log('f',fram)
  useEffect(() => {
    let intervalId;
    if(!isPaused){
      intervalId = setInterval(captureFrame, 1000); // Capture frame every 1 second
    }
  
    return () => clearInterval(intervalId);
  }, [isPaused,isRecording]);
  

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          // Ensure play() is called only once the video is ready
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch(error => console.error('Error playing video:', error));
          };
        }
      } catch (error) {
        console.error('Error accessing user media:', error);
      }
    };

    startVideo();

    return () => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      }
    };
  }, []);

  
  const validateForm = () => {
    const errors = {};

    if (!formValues.trainNo) {
      errors.trainNo = 'This field is required';
    }
    if (!formValues.route) {
      errors.route = 'This field is required';
    }
    if (!formValues.line) {
      errors.line = 'This field is required';
    }
    if (!formValues.associatingStaff) {
      errors.associatingStaff = 'This field is required';
    }
    if (!formValues.pantographModel) {
      errors.pantographModel = 'This field is required';
    }

    return errors;
  };

  const handleSubmit = () => {
    setHasSubmitted(true);
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      // Submit form if no errors
      console.log('Form submitted:', formValues);
      setOpenModal(false);
    }
  };


  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        paddingTop: 7,
        overflow: "hidden",
      }}
    >
      <Dialog
        open={openModal}
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            setOpenModal(false);
          }
        }}
        fullWidth
        disableBackdropClick
        disableEscapeKeyDown
        BackdropProps={{ style: { pointerEvents: "none" } }}
      >
        <DialogTitle>Select</DialogTitle>
        <DialogContent>
          {/* Train/Loco No TextField */}
          <Grid container justifyContent="space-between">
            <Grid item xs={12} md={5.5}>
              <TextField
                label="Train/Loco No"
                name="trainNo"
                fullWidth
                margin="normal"
                value={formValues.trainNo} // Updated to trainNo
                onChange={handleChange}
                required
                error={hasSubmitted && !!formErrors.trainNo}
                helperText={hasSubmitted && formErrors.trainNo}
              />
            </Grid>
            <Grid item xs={12} md={5.5}>
              {/* Route Dropdown */}
              <TextField
                select
                label="Route"
                name="route"
                fullWidth
                margin="normal"
                value={formValues.route}
                onChange={handleChange}
                required // Required field
                error={hasSubmitted && !!formErrors.route}
                helperText={hasSubmitted && formErrors.route}
              >
                <MenuItem value="Route 1">Route 1</MenuItem>
                <MenuItem value="Route 2">Route 2</MenuItem>
                <MenuItem value="Route 3">Route 3</MenuItem>
                {/* Add more routes as needed */}
              </TextField>
            </Grid>
          </Grid>

          <Grid container justifyContent="space-between">
            <Grid item xs={12} md={5.5}>
              {/* Line Dropdown */}
              <TextField
                select
                label="Line"
                name="line"
                fullWidth
                margin="normal"
                value={formValues.line}
                onChange={handleChange}
                required
                error={hasSubmitted && !!formErrors.line}
                helperText={hasSubmitted && formErrors.line}
              >
                <MenuItem value="Line 1">Line 1</MenuItem>
                <MenuItem value="Line 2">Line 2</MenuItem>
                <MenuItem value="Line 3">Line 3</MenuItem>
                {/* Add more lines as needed */}
              </TextField>
            </Grid>
            <Grid item xs={12} md={5.5}>
              <TextField
                label="Crew"
                name="crew"
                fullWidth
                margin="normal"
                value={formValues.crew}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Grid container justifyContent="space-between">
            <Grid item xs={12} md={5.5}>
              <TextField
                label="Associating Staff"
                name="associatingStaff"
                fullWidth
                margin="normal"
                value={formValues.associatingStaff}
                onChange={handleChange}
                required
                error={hasSubmitted && !!formErrors.associatingStaff}
                helperText={hasSubmitted && formErrors.associatingStaff}
              />
            </Grid>
            <Grid item xs={12} md={5.5}>
              <TextField
                label="Pantograph Model"
                name="pantographModel"
                fullWidth
                margin="normal"
                value={formValues.pantographModel}
                onChange={handleChange}
                required
                error={hasSubmitted && !!formErrors.pantographModel}
                helperText={hasSubmitted && formErrors.pantographModel}
              />
            </Grid>
          </Grid>
          <Grid container justifyContent="space-between">
            <Grid item xs={12} md={5.5}>
              <TextField
                label="Type of OHE"
                name="typeOfOHE"
                fullWidth
                margin="normal"
                value={formValues.typeOfOHE}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={5.5}>
              <TextField
                label="Sag"
                name="sag"
                fullWidth
                margin="normal"
                value={formValues.sag}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Grid container justifyContent="space-between">
            <Grid item xs={12} md={5.5}>
              <TextField
                label="Tension in wire"
                name="tensionInWire"
                fullWidth
                margin="normal"
                value={formValues.tensionInWire}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={5.5}>
              <TextField
                select
                label="Weather condition"
                name="weather"
                fullWidth
                margin="normal"
                value={formValues.weather}
                onChange={handleChange}
              >
                <MenuItem value="Rain">Rain</MenuItem>
                <MenuItem value="Wind">Wind</MenuItem>
                <MenuItem value="Ice">Ice</MenuItem>
                <MenuItem value="Temp">Temperature</MenuItem>
                {/* Add more lines as needed */}
              </TextField>
            </Grid>
            {formValues.weather === "Temp" && (
              <Grid item xs={12} md={5.5}>
                <TextField
                  label="Temperature"
                  name="temperature"
                  fullWidth
                  margin="normal"
                  value={formValues.temperature}
                  onChange={handleChange}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate("/")} color="primary">
            Close
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Paper
        elevation={6}
        sx={{
          flex: 1,
          padding: 2,

          display: "flex",
          flexDirection: "column",
          backgroundColor: isNightMode ? "#333" : "#f5f5f5",
          color: isNightMode ? "#fff" : "#000",
        }}
      >
        <Grid
          container
          // spacing={2}
          alignItems="center"
          justifyContent="space-between"
          sx={{ background: "black", padding: 2 }}
        >
          <Grid item sx={8} md={8} container>
            <Typography
              sx={{ fontWeight: "bold", marginRight: 10 }}
              color="teal"
              style={{ fontSize: "1vw" }}
            >
              TRAIN/LOCO NO. {formValues.trainNo}
            </Typography>
            <Typography
              sx={{ fontWeight: "bold", marginRight: 10 }}
              color="teal"
              style={{ fontSize: "1vw" }}
            >
              ROUTE: {formValues.route} | LINE : {formValues.line}
            </Typography>
            <Typography
              sx={{ fontWeight: "bold", marginRight: 10 }}
              color="teal"
              style={{ fontSize: "1vw" }}
            >
              Section:
            </Typography>
            <Typography
              sx={{ fontWeight: "bold" }}
              color="teal"
              style={{ fontSize: "1vw" }}
            >
              TRD Feature:
            </Typography>
          </Grid>
          <Grid item md={2} xs={12}>
            <Typography
              textAlign="center"
              sx={{ fontWeight: "bold" }}
              color="teal"
              style={{ fontSize: "1vw" }}
            >
              ENG. FEATURE
            </Typography>
          </Grid>
        </Grid>

        <Grid
          container
          // spacing={2}
          alignItems="center"
          // justifyContent="space-between"
          sx={{ background: "black", paddingX: 2 }}
        >
          <Grid item xs={2}>
            <Switch
              checked={isNightMode}
              onChange={() => setIsNightMode(!isNightMode)}
            />
            <Typography style={{ fontSize: "1vw" }} component="span">
              {isNightMode ? "Night Mode" : "Day Mode"}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Switch checked={isGPS} onChange={() => setIsGPS(!isGPS)} />
            <Typography style={{ fontSize: "1vw" }} component="span">
              GPS
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography style={{ fontSize: "1vw" }}>
              Recording: {isRecording ? "ON" : "OFF"}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography style={{ fontSize: "1vw" }}>Time: HH:MM</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ marginY: 2 }} />

        <Grid container spacing={2} sx={{ height: "100vh" }}>
          <Grid item xs={8}>
            <Box
              id="videoContainer"
              sx={{
                position: "relative",
                backgroundColor: "#000",
                height: "60vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {cameraError ? (
                <Box textAlign="center">
                  <VideocamOff sx={{ fontSize: 60, color: "white" }} />
                  <Typography variant="h6" color="error">
                    There is no connected camera.
                  </Typography>
                </Box>
              ) : (
                frames && (
                  <img
                    id="webcam"
                    style={{ width: "100%", height: "100%" }}
                    src={`data:image/jpeg;base64,${frames}`}
                    alt="Camera Feed"
                    ref={videoRef}
                  />
                )
              )}
              <video ref={videoRef} style={{ display: "none" }} />
              <canvas ref={canvasRef} style={{ display: "none" }} />
              {/* <video
                  id="webcam"
                  ref={videoRef}
                  autoPlay
                 
                  controls={false}
                  playsInline
                  muted
                /> */}
              <Box sx={{ position: "absolute", top: 10, right: 10 }}>
                <IconButton onClick={handleFullScreenToggle} color="teal">
                  {isFullScreen ? <FullscreenExit /> : <Fullscreen />}
                </IconButton>
              </Box>
               <Box sx={{ position: "absolute", top: 10, left: 10 }}>
               <Typography variant="h6" sx={{ color: "white" }}>
                  Contact Points:{" "}
                  <span style={{ color: "teal", fontWeight: 800 }}>{contactPoints}</span>
                </Typography>
                <Typography variant="h6" sx={{ color: "white" }}>
                  PantoHeight:{" "}
                  <span style={{ color: "teal", fontWeight: 800 }}>{height}</span>
                </Typography>
              </Box> 
            </Box>

            <Divider sx={{ marginY: 2 }} />
            <Grid
              container
              spacing={2}
              justifyContent="space-between"
              sx={{ paddingX: 2 }}
            >
              {!isRecording ? (
                <Button
                  startIcon={<FiberManualRecord />}
                  sx={{ background: "orange", color: "white" }}
                  onClick={handleStartRecording}
                >
                  START
                </Button>
              ) : isPaused ? (
                <Button
                  startIcon={<FiberManualRecord />}
                  sx={{ background: "red", color: "white" }}
                  onClick={handleResumeRecording}
                >
                  RESUME
                </Button>
              ) : (
                <Button
                  startIcon={<Pause />}
                  variant="contained"
                  color="primary"
                  onClick={handlePauseRecording}
                >
                  PAUSE
                </Button>
              )}
              <Typography
                style={{ fontSize: "1.5vw" }}
                textAlign="center"
                fontWeight={800}
                sx={{ color: isNightMode ? "#ccc" : "#000", marginTop: 3 }}
              >
                Last: 00/00 | Current: 00/00 | Next: 00/00
              </Typography>
              <Button
                startIcon={<Pause />}
                variant="contained"
                sx={{ background: "teal" }}
                
              >
                SAVE AND EXIT
              </Button>
              {/* <Button startIcon={<SpeedIcon />} sx={{ background: 'blue', color: 'white' }}>
              Speed: 000.00 KMPH
            </Button> */}
            </Grid>
          </Grid>

          <Grid item xs={2}>
            <Box
              sx={{
                backgroundColor: isNightMode ? "#444" : "#fff",
                // height: "75vh",
                padding: 2,
                borderRadius: 2,
                border: "2px solid teal",
              }}
            >
              <Typography
                style={{ fontSize: "2vw" }}
                sx={{ fontWeight: "bold" }}
              >
                Last Details
              </Typography>

              <Box
                sx={{
                  marginY: 5,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CameraAlt sx={{ fontSize: 60, color: "gray" }} />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", marginY: 1 }}>
                <AccessTime sx={{ marginRight: 1 }} />
                <Typography style={{ fontSize: "1vw" }}>
                  Time: YYYY-MM-DD HH:mm:ss
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", marginTop: 1 }}>
                <LocationOn sx={{ marginRight: 1 }} />
                <Typography style={{ fontSize: "1vw" }}>
                  Location: 00
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", marginTop: 1 }}>
                <Height sx={{ marginRight: 1 }} />
                <Typography style={{ fontSize: "1vw" }}>
                  OHE Height: 00
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", marginTop: 1 }}>
                <Straighten sx={{ marginRight: 1 }} />
                <Typography style={{ fontSize: "1vw" }}>CP 1: 00</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", marginTop: 1 }}>
                <Straighten sx={{ marginRight: 1 }} />
                <Typography style={{ fontSize: "1vw" }}>CP 2: 00</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", marginTop: 1 }}>
                <Straighten sx={{ marginRight: 1 }} />
                <Typography style={{ fontSize: "1vw" }}>CP 3: 00</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", marginTop: 1 }}>
                <Straighten sx={{ marginRight: 1 }} />
                <Typography style={{ fontSize: "1vw" }}>CP 4: 00</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", marginTop: 1 }}>
                <Straighten sx={{ marginRight: 1 }} />
                <Typography style={{ fontSize: "1vw" }}>CP 5: 00</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", marginTop: 1 }}>
                <SwapHoriz sx={{ marginRight: 1 }} />
                <Typography style={{ fontSize: "1vw" }}>IMP: 00</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={2}>
            <Box
              sx={{
                backgroundColor: isNightMode ? "#444" : "#fff",
                // height: "75vh",
                padding: 2,
                borderRadius: 2,
                border: "2px solid teal",
              }}
            >
              <Typography
                style={{ fontSize: "2vw" }}
                textAlign="center"
                sx={{ fontWeight: "bold" }}
              >
                Speed
              </Typography>
              <Typography
                style={{ fontSize: "1.5vw" }}
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  margin: "10px 0",
                }}
              >
                000.00 KM/H
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginY: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <AccessTime sx={{ marginRight: 1 }} />
                  <Typography style={{ fontSize: "1vw" }}>
                    Time Elapsed
                  </Typography>
                </Box>
                <Typography style={{ fontSize: "1vw" }}>00</Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginY: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <DirectionsWalk sx={{ marginRight: 1 }} />
                  <Typography style={{ fontSize: "1vw" }}>
                    Distance Traveled
                  </Typography>
                </Box>
                <Typography style={{ fontSize: "1vw" }}>00</Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginY: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Satellite sx={{ marginRight: 1 }} />
                  <Typography style={{ fontSize: "1vw" }}>
                    Satellites
                  </Typography>
                </Box>
                <Typography style={{ fontSize: "1vw" }}>0</Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginY: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Explore sx={{ marginRight: 1 }} />
                  <Typography style={{ fontSize: "1vw" }}>Longitude</Typography>
                </Box>
                <Typography style={{ fontSize: "1vw" }}>0</Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginY: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Explore sx={{ marginRight: 1 }} />
                  <Typography style={{ fontSize: "1vw" }}>Latitude</Typography>
                </Box>
                <Typography style={{ fontSize: "1vw" }}>0</Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginY: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Height sx={{ marginRight: 1 }} />
                  <Typography style={{ fontSize: "1vw" }}>Altitude</Typography>
                </Box>
                <Typography style={{ fontSize: "1vw" }}>0</Typography>
              </Box>
              <Typography
                style={{ fontSize: "1vw" }}
                sx={{
                  fontWeight: "900",
                  textAlign: "center",
                  margin: "16px 0",
                  fontSize: 18,
                }}
              >
                Last 3 Details
              </Typography>
              <Grid container justifyContent="space-between">
                <Grid item xs={6}>
                  <Typography
                    style={{ fontSize: "1vw" }}
                    textAlign="center"
                    color="#00E5FF"
                  >
                    {" "}
                    Location
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    style={{ fontSize: "1vw" }}
                    textAlign="center"
                    color="#00E5FF"
                  >
                    {" "}
                    PantoHeight
                  </Typography>
                </Grid>
              </Grid>
              <Divider sx={{ marginY: 1 }} />
              <Grid container justifyContent="space-between">
                <Grid item xs={6}>
                  <Typography style={{ fontSize: "1vw" }} textAlign="center">
                    {" "}
                    Loc 1
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography style={{ fontSize: "1vw" }} textAlign="center">
                    00
                  </Typography>
                </Grid>
              </Grid>
              <Divider sx={{ marginY: 1 }} />
              <Grid container justifyContent="space-between">
                <Grid item xs={6}>
                  <Typography style={{ fontSize: "1vw" }} textAlign="center">
                    {" "}
                    Loc 2
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography style={{ fontSize: "1vw" }} textAlign="center">
                    {" "}
                    00
                  </Typography>
                </Grid>
              </Grid>
              <Divider sx={{ marginY: 1 }} />
              <Grid container justifyContent="space-between">
                <Grid item xs={6}>
                  <Typography style={{ fontSize: "1vw" }} textAlign="center">
                    {" "}
                    Loc 3
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography style={{ fontSize: "1vw" }} textAlign="center">
                    {" "}
                    00
                  </Typography>
                </Grid>
              </Grid>
              {/* <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{fontWeight:"700"}}>Location</TableCell>
                    <TableCell sx={{fontWeight:"700"}}>Altitude</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.location}</TableCell>
                      <TableCell>{row.altitude}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table> */}
            </Box>
          </Grid>
        </Grid>
      </Paper>
      <Dialog open={openPauseDialog} onClose={() => setOpenPauseDialog(false)}>
        <DialogTitle>Pause Recording</DialogTitle>
        <DialogContent>
          Are you sure you want to pause the recording?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPauseDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmPause} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openResumeDialog}
        onClose={() => setOpenResumeDialog(false)}
      >
        <DialogTitle>Resume Recording</DialogTitle>
        <DialogContent>
          Are you sure you want to resume the recording?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResumeDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmResume} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openNavigateDialog}
        onClose={() => setOpenNavigateDialog(false)}
      >
        <DialogTitle>Leave Page</DialogTitle>
        <DialogContent>
          Recording will be paused if you leave this page. Are you sure you want
          to leave?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNavigateDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmNavigation} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CameraView;
