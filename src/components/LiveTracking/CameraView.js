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
  VideocamOff
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

  const videoRef = useRef(null);

  const data = [
    { location: "Loc 1", altitude: "1000 m" },
    { location: "Loc 2", altitude: "1500 m" },
    { location: "Loc 3", altitude: "2000 m" },
  ];
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [openPauseDialog, setOpenPauseDialog] = useState(false);
  const [openResumeDialog, setOpenResumeDialog] = useState(false);
  const [openNavigateDialog, setOpenNavigateDialog] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const [frames, setFrames] = useState([]);

  useEffect(() => {
    const fetchFrames = async () => {
      try {
        const url = "http://127.0.0.1:5000/process-camera-feed";
        
        // Fetch the frames from the API
        const response = await axios.post(url);
        
        // Set the frames in state
        setFrames(response.data);
      } catch (error) {
        console.error('Error fetching video frames:', error);
      }
    };

    fetchFrames();
  }, []);

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

  const handleSubmit = () => {
    // Close the modal after submission
    setOpenModal(false);
  };

  // useEffect(() => {
  //   const startCamera = async () => {
  //     try {
  //       const stream = await navigator.mediaDevices.getUserMedia({
  //         video: true,
  //       });
  //       const videoElement = document.getElementById("webcam");
  //       if (videoElement) {
  //         videoElement.srcObject = stream;
  //       }
  //       setCameraError(null);
  //     } catch (error) {
  //       setCameraError("Camera is not connected or accessible.");
  //     }
  //   };

  //   startCamera();

  //   return () => {
  //     const videoElement = document.getElementById("webcam");
  //     if (videoElement && videoElement.srcObject) {
  //       const stream = videoElement.srcObject;
  //       const tracks = stream.getTracks();
  //       tracks.forEach((track) => track.stop());
  //     }
  //   };
  // }, []);
  
  return (
    <Box
      sx={{
        // height: "100vh",
        display: "flex",
        flexDirection: "column",

        // overflow: "hidden",
      }}
    >
      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth>
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
          <Grid item md={8} xs={12} container>
            <Typography
              sx={{ fontWeight: "bold", marginRight: 10 }}
              color="teal"
            >
              TRAIN/LOCO NO. {formValues.trainNo}
            </Typography>
            <Typography
              sx={{ fontWeight: "bold", marginRight: 10 }}
              color="teal"
            >
              ROUTE: {formValues.route} | LINE : {formValues.line}
            </Typography>
            <Typography
              sx={{ fontWeight: "bold", marginRight: 10 }}
              color="teal"
            >
              Section:
            </Typography>
            <Typography sx={{ fontWeight: "bold" }} color="teal">
              TRD Feature:
            </Typography>
          </Grid>
          <Grid item md={4} xs={12}>
            <Typography
              textAlign="center"
              sx={{ fontWeight: "bold" }}
              color="teal"
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
            <Typography variant="body1" component="span">
              {isNightMode ? "Night Mode" : "Day Mode"}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Switch checked={isGPS} onChange={() => setIsGPS(!isGPS)} />
            <Typography variant="body1" component="span">
              GPS
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>Recording: {isRecording ? "ON" : "OFF"}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>Time: HH:MM</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ marginY: 2 }} />

        <Grid container spacing={2} sx={{ height: "100vh" }}>
          <Grid item md={8} xs={12}>
            <Box
              id="videoContainer"
              sx={{
                position: "relative",
                backgroundColor: "#000",
                height: "69vh",
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
                frames.length > 0 && (
                  <img
                    id="webcam"
                    style={{ width: "100%", height: "100%" }}
                    src={`data:image/jpeg;base64,${frames[0]}`}
                    alt="Camera Feed"
                  />
                )
              )}
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
                {/* <Typography variant="h6" sx={{ color: "white" }}>
                  Live Intensity: <span style={{ color: "teal",fontWeight:"600" }}>00</span>
                </Typography> */}
                <Typography variant="h6" sx={{ color: "white" }}>
                  Time:{" "}
                  <span style={{ color: "teal", fontWeight: 800 }}>00</span>
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="h6"
              textAlign="center"
              fontWeight={800}
              sx={{ color: isNightMode ? "#ccc" : "#000", marginTop: 3 }}
            >
              Last: 00/00 | Current: 00/00 | Next: 00/00
            </Typography>

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

          <Grid item xs={6} md={2}>
            <Box
              sx={{
                backgroundColor: isNightMode ? "#444" : "#fff",
                // height: "75vh",
                padding: 2,
                borderRadius: 2,
                border: "2px solid teal",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
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
              <Box sx={{ display: "flex", alignItems: "center", marginY: 2 }}>
                <AccessTime sx={{ marginRight: 1 }} />
                <Typography>Time: YYYY-MM-DD HH:mm:ss</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
                <LocationOn sx={{ marginRight: 1 }} />
                <Typography variant="body2">Location: 00</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
                <Height sx={{ marginRight: 1 }} />
                <Typography variant="body2">OHE Height: 00</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
                <Straighten sx={{ marginRight: 1 }} />
                <Typography variant="body2">Stagger 1: 00</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
                <Straighten sx={{ marginRight: 1 }} />
                <Typography variant="body2">Stagger 2: 00</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
                <Straighten sx={{ marginRight: 1 }} />
                <Typography variant="body2">Stagger 3: 00</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
                <Straighten sx={{ marginRight: 1 }} />
                <Typography variant="body2">Stagger 4: 00</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
                <Straighten sx={{ marginRight: 1 }} />
                <Typography variant="body2">Stagger 5: 00</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
                <FlashOn sx={{ marginRight: 1 }} />
                <Typography variant="body2">IMP: 00</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={6} md={2}>
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
                variant="h6"
                textAlign="center"
                sx={{ fontWeight: "bold" }}
              >
                Speed
              </Typography>
              <Typography
                variant="h6"
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
                  <Typography variant="body2">Time Elapsed</Typography>
                </Box>
                <Typography variant="body2">00</Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginY: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <DirectionsWalk sx={{ marginRight: 1 }} />
                  <Typography variant="body2">Distance Traveled</Typography>
                </Box>
                <Typography variant="body2">00</Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginY: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Satellite sx={{ marginRight: 1 }} />
                  <Typography variant="body2">Satellites</Typography>
                </Box>
                <Typography variant="body2">0</Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginY: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Explore sx={{ marginRight: 1 }} />
                  <Typography variant="body2">Longitude</Typography>
                </Box>
                <Typography variant="body2">0</Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginY: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Explore sx={{ marginRight: 1 }} />
                  <Typography variant="body2">Latitude</Typography>
                </Box>
                <Typography variant="body2">0</Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginY: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Height sx={{ marginRight: 1 }} />
                  <Typography variant="body2">Altitude</Typography>
                </Box>
                <Typography variant="body2">0</Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "700",
                  textAlign: "center",
                  margin: "16px 0",
                  fontSize: 20,
                }}
              >
                Last 3 Details
              </Typography>
              <Grid container justifyContent="space-between">
                <Grid item xs={12} md={6}>
                  <Typography textAlign="center" color="#00E5FF">
                    {" "}
                    Location
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography textAlign="center" color="#00E5FF">
                    {" "}
                    Panto Height
                  </Typography>
                </Grid>
              </Grid>
              <Divider sx={{ marginY: 1 }} />
              <Grid container justifyContent="space-between">
                <Grid item xs={12} md={6}>
                  <Typography textAlign="center"> Loc 1</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography textAlign="center">00</Typography>
                </Grid>
              </Grid>
              <Divider sx={{ marginY: 1 }} />
              <Grid container justifyContent="space-between">
                <Grid item xs={12} md={6}>
                  <Typography textAlign="center"> Loc 2</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography textAlign="center"> 00</Typography>
                </Grid>
              </Grid>
              <Divider sx={{ marginY: 1 }} />
              <Grid container justifyContent="space-between">
                <Grid item xs={12} md={6}>
                  <Typography textAlign="center"> Loc 3</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography textAlign="center"> 00</Typography>
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
