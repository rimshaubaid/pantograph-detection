import React, { useEffect, useState, useRef } from "react";
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
import { FFmpeg } from "@ffmpeg/ffmpeg";
import axios from "axios";
import { fetchFile } from "@ffmpeg/util";
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
  Height,
  LocationOn,
  Straighten,
  FlashOn,
  VideocamOff,
  SwapHoriz,
} from "@mui/icons-material";

import { usePrompt } from "../usePrompt.js";
import { useNavigate  } from "react-router-dom";
let framesArray = [];
const apiUrl = process.env.REACT_APP_API_URL;
const CameraView = () => {
  

  const navigate = useNavigate();

  const [cameraError, setCameraError] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [isNightMode, setIsNightMode] = useState(true);
  const [isGPS, setIsGPS] = useState(true);
  const [isVideoProcessing, setIsVideoProcessing] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [lang, setLang] = useState(0);
  const [lat, setLat] = useState(0);
  const [prevDistance,setPrevDistance] = useState(0);
  const [nextDistance,setNextDistance] = useState(0);
  const [gpsPort, setGpsPort] = useState("");
  const [speed,setSpeed] = useState(0);
  const [openModal, setOpenModal] = useState(true);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
  const [prevLocation, setPrevLocation] = useState("");
  const [currLocation, setCurrLocation] = useState("");
  const [nextLocation, setNextLocation] = useState("");
  const ffmpeg = useRef(new FFmpeg()).current;
  const [formValues, setFormValues] = useState({
    trainNo: "", // Added trainNo for the Train/Loco No text field
    route: "",
    line: "", // Added line for the Line dropdown
    crew: "",
    pantographHeight: "",
    associatingStaff: "",
    pantographModel: "",
    typeOfOHE: "",
    sag: "",
    tensionInWire: "",
    weather: "",
    temperature: "",
  });
    // Using the usePrompt hook to show a confirmation dialog
   usePrompt('You have unsaved changes, are you sure you want to leave?', true);
  const [formErrors, setFormErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(null);
  const videoRef = useRef(null);
  const [isDirty,setDirty] = useState(false);
  const frameRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isRecording, setIsRecording] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [openPauseDialog, setOpenPauseDialog] = useState(false);
  const [openResumeDialog, setOpenResumeDialog] = useState(false);
  const [openNavigateDialog, setOpenNavigateDialog] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [selectedResolution, setSelectedResolution] = useState(null);
  // const [loading,setLoading] = useState()
  const [frames, setFrames] = useState([]);
  const [contactPoints, setContactPoints] = useState(null);
  const [height, setHeight] = useState(null);
  const [routeData, setRouteData] = useState([]);
  const [gpsLang,setGPSLang] = useState(0);
  const [gpsLat,setGPSLat] = useState(0);
  useEffect(() => {
    let mediaStream; // Declare mediaStream variable in the outer scope

    // Function to turn off the camera if it's on
    const turnOffCamera = async () => {
      try {
        // Get the media stream from the camera
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });

        // If the stream is active, stop all tracks (turn off camera)
        if (mediaStream && mediaStream.active) {
          mediaStream.getTracks().forEach(track => track.stop());
          console.log("Camera turned off");
        }
      } catch (error) {
        console.error("Error accessing camera devices.", error);
      }
    };

    // Turn off the camera as soon as the component renders
    turnOffCamera();

    // Cleanup function to ensure the stream is always stopped on unmount
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        console.log("Camera stopped on component unmount");
      }
    };
  }, []);

  useEffect(() => {
    setDirty(true);
  },[navigate])
  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     console.log('here!!')
  //     // Cancel the event
  //     event.preventDefault();
  //     // Chrome requires returnValue to be set
  //     event.returnValue = '';
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     // Cleanup
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, []);
  
  useEffect(() => {
    getRouteData();
  }, []);
  const getRouteData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/fetch-route-data`);
      const data = response?.data?.data;

      // Extract only the Route names
      const routes = [...new Set(data.map((item) => item.Route))];

      // Set state with Route names
      setRouteData(routes);
    } catch (err) {}
  };
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
  
      // Format: YYYY-MM-DD HH:MM:SS
      const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      setCurrentDateTime(formattedDateTime);
    }, 1000); // Update every second
  
    return () => clearInterval(timer); // Cleanup the interval on component unmount
  }, []);

  useEffect(() => {
    const loadFFmpeg = async () => {
      try {
        await ffmpeg.load();
        setFfmpegLoaded(true);
      } catch (error) {
        console.error("Failed to load FFmpeg", error);
      }
    };

    loadFFmpeg();
  }, [ffmpeg]);
  const handleSubmit = async () => {
    setHasSubmitted(true);
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        // Submit form if no errors
        const routeData = {
          current_route: formValues.route,
        };

        await axios.post(`${apiUrl}/set-route`, {
          routeData, // Sending the route in the request body
        });

        setOpenModal(false);
        startVideo();
      } catch (error) {
        // Handle any errors that occur during the API call
        console.error("Error submitting form:", error);
      }
    }
  };
  
  // Fetch the list of connected cameras
  // useEffect(() => {
  //   const getCameras = async () => {
  //     try {
  //       const devices = await navigator.mediaDevices.enumerateDevices();
  //       const videoDevices = devices.filter((device) => device.kind === "videoinput");
  //       setCameras(videoDevices);
  //     } catch (error) {
  //       console.error("Error fetching camera devices.", error);
  //     }
  //   };
  //   getCameras();

  
  // }, []);

  // useEffect(() => {
  //   //if camera isnt selected
  //   const cam = localStorage.getItem("deviceId");
  //   const res = localStorage.getItem("resolution");
    
  //   if (!cam) {
  //     setSelectedCamera(0);
  //   } else {
  //     setSelectedCamera(cam);
  //   }
  //   if (res) {
  //     setSelectedResolution(res);
  //   } else {
  //     setSelectedResolution("640x480");
  //   }
  // }, []);

  // useEffect(() => {
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
    const gps = localStorage.getItem("gps_port");
    if (!gps) {
      getGPSDevices();
    } else {
      setGpsPort(gps);
    }
  }, []);
  


  const getGPSDevices = async () => {
    try {
      const response = await axios.get(`${apiUrl}/list-gps-devices`);
      setGpsPort(response.data?.GPS_Devices[0]?.name);
    } catch (err) {}
  };
  useEffect(() => {
    if (isGPS && gpsPort) {
      connectGPS();
    }
  }, [isGPS,gpsPort]);
  const connectGPS = async () => {
    try {
      const requestBody = { serial_port: gpsPort };

      const response = await axios.post(`${apiUrl}/connect_gps`, requestBody);
      if(response){
        setGPSLang(response.data.longitude);
        setGPSLat(response.data.latitude);
      }
   
    } catch (err) {
      alert(err?.response?.data?.error);
    }
  };
  
  // useEffect(() => {
  //   if (!formValues?.route) {
  //     return; // Do not proceed if formValues.route doesn't exist
  //   }
    
  //   const eventSource = new EventSource(
  //     `${apiUrl}/process-camera-feed?device_id=${selectedCamera}&route=${formValues?.route}`
  //   );

  //   eventSource.onmessage = (event) => {
  //     try {
  
  //       const data = JSON.parse(event.data);
  //       console.group('d',data)
  //       if (data.processed_frame) {

  //         setCurrentFrame(data.processed_frame);
  //         setContactPoints(data.contact_points);
  //         setHeight(data.pantograph_height);
  //         setLang(data.longitude);
  //         setLat(data.latitude);
  //         setCurrLocation(data.current_location);
  //         setPrevLocation(data.previous_location);
  //         setNextLocation(data.next_location);
  //         setPrevDistance(data.previous_distance);
  //         setNextDistance(data.next_distance);
  //         setSpeed(data.speed_kmh);
  //       }
  //     } catch (error) {
  //       console.error("Error parsing event data:", error);
  //     }
  //   };

  //   eventSource.onerror = () => {
  //     console.error("Error connecting to server:");
  //   };

  //   return () => {
  //     eventSource.close();
  //   };
  // }, [handleSubmit]);

  // useEffect(() => {
  //   if (currentFrame && frameRef.current) {
  //     frameRef.current.src = `data:image/jpeg;base64,${currentFrame}`;
  //   }
  // }, [currentFrame]);
  const [frameData, setFrameData] = useState(null); // State to hold the frame data

  // useEffect(() => {
  //   if(!formValues.route){
  //     return;
  //   }
  //   if(selectedCamera === null){
  //     return;
  //   }
  //   const fetchFrame = async () => {
  //     try {
  //       const response = await fetch(
  //         `${apiUrl}/process-camera-feed?camera_type=${selectedCamera}&resolution=${selectedResolution}&route=${formValues.route}`
  //       );
  //       const data = await response.json(); // Parse JSON response

  //       if (data?.frame) {
          
  //         setFrameData(data); // Save the entire data, including the frame
  //          // Update other pieces of information
  //         framesArray.push(data?.frame);
  //         setContactPoints(data.contact_points);
  //         setHeight(data.pantograph_height);
  //         setLang(data.longitude);
  //         setLat(data.latitude);
  //         setCurrLocation(data.current_location);
  //         setPrevLocation(data.previous_location);
  //         setNextLocation(data.next_location);
  //         setPrevDistance(data.previous_distance);
  //         setNextDistance(data.next_distance);
  //         setSpeed(data.speed_kmh);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching the camera feed:', error);
  //     }
  //   };

  //   // Only fetch frames if the feed is not paused
  //   if (!isPaused) {
  //     const intervalId = setInterval(() => {
  //       fetchFrame();
  //     }, 60); // Fetch the frame every second

  //     return () => clearInterval(intervalId); // Cleanup on component unmount or if paused
  //   }
  // }, [openModal, isPaused]);

  // useEffect(() => {
  //   // When frameData is updated, update the img source
  //   if (frameData?.frame && frameRef.current) {
  //     frameRef.current.src = `data:image/jpeg;base64,${frameData.frame}`; // Convert the base64 frame to an image source
  //   }
  // }, [frameData]);
  const releaseCamera = async () => {
    try {
      
      await axios.post(`${apiUrl}/release-camera`);
    } catch (err) {}
  };

  const saveVideo = async () => {
    releaseCamera();
    if (!ffmpegLoaded) {
      await ffmpeg.load();
    }

    setIsVideoProcessing(true);

    // Save each frame as an image file in FFmpeg's virtual file system
    for (let i = 0; i < framesArray.length; i++) {
      const frame = framesArray[i];

      await ffmpeg.writeFile(
        `frame${i}.jpg`,
        await fetchFile(`data:image/jpeg;base64,${frame}`)
      );
    }

    // Create a video from the frames using FFmpeg
    await ffmpeg.exec([
      "-framerate",
      "24",
      "-i",
      "frame%d.jpg",
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "output.mp4",
    ]);

    const data = await ffmpeg.readFile("output.mp4");

    // Generate a blob URL for the video file
    const videoBlobUrl = URL.createObjectURL(
      new Blob([data.buffer], { type: "video/mp4" })
    );
    setVideoUrl(videoBlobUrl);

    // Reset processing state
    setIsVideoProcessing(false);
    navigate("/");
  };

 

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
    // if(!formValues.route){
    //   return;
    // }
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
   
      // // Send base64 frame to backend
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/process-camera-feed?route=${formValues.route}`,
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
   
          // Split buffer by newlines to get frames
          // const frames = buffer.split("\n");
          // buffer = frames.pop(); // Keep any incomplete frame in buffer
  
       
              try {
               
                const parsedFrame = JSON.parse(buffer); // Parse the frame as JSON
                
                if (parsedFrame.frame) {
                  framesArray.push(parsedFrame.frame);
                  setFrames(parsedFrame.frame); // Update state with new frame
                  setContactPoints(parsedFrame?.contact_points);
                 setHeight(parsedFrame?.pantograph_height);
                 setContactPoints(parsedFrame?.contact_points);
            
                         setLang(parsedFrame?.longitude);
                          setLat(parsedFrame?.latitude);
                         setCurrLocation(parsedFrame?.current_location);
                          setPrevLocation(parsedFrame?.previous_location);
                          setNextLocation(parsedFrame?.next_location);
                          setPrevDistance(parsedFrame?.previous_distance);
                          setNextDistance(parsedFrame?.next_distance);
                          setSpeed(parsedFrame?.speed_kmh);
                }
              } catch (error) {
                console.error("Error parsing frame:", error);
              }
            
        
        }
      } catch (error) {
        console.error("Error sending frame to backend:", error);
      }
    }
  };

  useEffect(() => {
    let intervalId;
    if(!formValues.route && openModal){
      return;
    }
    if(!isPaused && formValues.route ){
      intervalId = setInterval(captureFrame, 100); // Capture frame every 1 second
    }

    return () => clearInterval(intervalId);
  }, [isPaused,isRecording,openModal]);

  const startVideo = async () => {
    try {
      // Check if "camera_type" and "resolution" exist in localStorage
      const storedCameraId = localStorage.getItem("camera_type");
      const storedResolution = localStorage.getItem("resolution");
  
      // Set default resolution to 640x480 if none is stored
      const [defaultWidth, defaultHeight] = storedResolution 
        ? storedResolution.split('x') 
        : [640, 480];
   
      // Set up constraints for getUserMedia
      let constraints = {
        video: {
          width: { exact: parseInt(defaultWidth) },
          height: { exact: parseInt(defaultHeight) },
        }
      };
  
      if (storedCameraId) {
        // If a specific camera is stored, add it to the constraints
        constraints.video.deviceId = { exact: storedCameraId };
      }
  
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
  
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
  
        // Ensure play() is called only once the video is ready
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch((error) => {
            console.error('Error playing video:', error);
          });
        };
      }
    } catch (error) {
      console.error('Error accessing user media:', error);
    }
  };

  useEffect(() => {

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
      errors.trainNo = "This field is required";
    }
    if (!formValues.route) {
      errors.route = "This field is required";
    }
    if (!formValues.line) {
      errors.line = "This field is required";
    }
    if (!formValues.associatingStaff) {
      errors.associatingStaff = "This field is required";
    }
    if (!formValues.pantographModel) {
      errors.pantographModel = "This field is required";
    }
    if (!formValues.pantographHeight) {
      errors.pantographHeight = "This field is required";
    }
    return errors;
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
          <Grid container justifyContent="center">
            <TextField
              label="Pantograph Height"
              name="pantographHeight"
              fullWidth
              margin="normal"
              value={formValues.pantographHeight}
              onChange={handleChange}
              required
              error={hasSubmitted && !!formErrors.pantographHeight}
              helperText={hasSubmitted && formErrors.pantographHeight}
            />
          </Grid>
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
                {routeData &&
                  routeData.map((route, index) => (
                    <MenuItem key={index} value={route}>
                      {route}
                    </MenuItem>
                  ))}
                {/* Add more routes as needed */}
              </TextField>
            </Grid>
          </Grid>

          <Grid container justifyContent="space-between">
            <Grid item xs={12} md={5.5}>
              {/* Line Dropdown */}
              <TextField
                label="Line"
                name="line"
                fullWidth
                margin="normal"
                value={formValues.line}
                onChange={handleChange}
                required
                error={hasSubmitted && !!formErrors.line}
                helperText={hasSubmitted && formErrors.line}
              />
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
            <Grid container justifyContent="space-between">
              <Grid item xs={12} md={5.5}></Grid>
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
              Recording: {isPaused ? "OFF" : "ON"}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography style={{ fontSize: "1vw" }}>
              Time: {currentDateTime}
            </Typography>
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
                <Typography variant="body2" sx={{ color: "white" }}>
                  PantoHeight:{" "}
                  <span style={{ color: "teal", fontWeight: 800 }}>
                    {height}
                  </span>
                </Typography>
                <Typography variant="body2" sx={{ color: "white" }}>
                  CP 1:{" "}
                  <span style={{ color: "teal", fontWeight: 800 }}>
                    {contactPoints && contactPoints[0]}
                  </span>
                </Typography>

                <Typography variant="body2" sx={{ color: "white" }}>
                  CP 2:{" "}
                  <span style={{ color: "teal", fontWeight: 800 }}>
                    {contactPoints && contactPoints[1]}
                  </span>
                </Typography>
                <Typography variant="body2" sx={{ color: "white" }}>
                  CP 3:{" "}
                  <span style={{ color: "teal", fontWeight: 800 }}>
                    {contactPoints && contactPoints[2]}
                  </span>
                </Typography>
                <Typography variant="body2" sx={{ color: "white" }}>
                  CP 4:
                  <span style={{ color: "teal", fontWeight: 800 }}>
                    {contactPoints && contactPoints[3]}
                  </span>
                </Typography>
                <Typography variant="body2" sx={{ color: "white" }}>
                  CP 5:
                  <span style={{ color: "teal", fontWeight: 800 }}>
                    {contactPoints && contactPoints[4]}
                  </span>
                </Typography>
              </Box>
              <Grid
                container
                sx={{ position: "absolute", bottom: 30, left: 10 }}
                justifyContent="space-around"
              >
                <Typography variant="body2" sx={{ color: "white" }}>
                  Section:{" "}
                  <span style={{ color: "teal", fontWeight: 800 }}>
                    {formValues.route}
                  </span>
                </Typography>
                <Typography variant="body2" sx={{ color: "white" }}>
                  <span style={{ color: "teal", fontWeight: 800 }}>
                    [Location : {currLocation} ({prevDistance}) (P) , {nextLocation} ({nextDistance}) (N) ]
                  </span>
                </Typography>
                <Typography variant="body2" sx={{ color: "white" }}>
                  Speed:
                  <span style={{ color: "teal", fontWeight: 800 }}>{speed}</span>
                </Typography>
                <Typography variant="body2" sx={{ color: "white" }}>
                  <span style={{ color: "teal", fontWeight: 800 }}>
                    {currentDateTime}
                  </span>
                </Typography>
              </Grid>
             
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
                Last: {prevLocation} | Current: {currLocation} | Next:{" "}
                {nextLocation}
              </Typography>
              {!videoUrl && (
                <Button
                  startIcon={<Pause />}
                  variant="contained"
                  sx={{ background: "teal" }}
                  onClick={saveVideo}
                >
                  SAVE AND EXIT
                </Button>
              )}
              {videoUrl && (
                <a href={videoUrl} download="processed_video.mp4">
                  <Button variant="contained" color="primary">
                    Download Video
                  </Button>
                </a>
              )}
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
                  Location: {prevLocation}
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
                <Typography style={{ fontSize: "1vw" }}>
                  CP 1: {contactPoints && (contactPoints?.[0] || "-")}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", marginTop: 1 }}>
                <Straighten sx={{ marginRight: 1 }} />
                <Typography style={{ fontSize: "1vw" }}>
                  CP 2: {contactPoints && (contactPoints?.[1] || "-")}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", marginTop: 1 }}>
                <Straighten sx={{ marginRight: 1 }} />
                <Typography style={{ fontSize: "1vw" }}>
                  CP 3: {contactPoints && (contactPoints?.[2] || "-")}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", marginTop: 1 }}>
                <Straighten sx={{ marginRight: 1 }} />
                <Typography style={{ fontSize: "1vw" }}>
                  CP 4: {contactPoints && (contactPoints?.[3] || "-")}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", marginTop: 1 }}>
                <Straighten sx={{ marginRight: 1 }} />
                <Typography style={{ fontSize: "1vw" }}>
                  CP 5: {contactPoints && (contactPoints?.[4] || "-")}
                </Typography>
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
                {speed} KM/H
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
                <Typography style={{ fontSize: "1vw" }}>{gpsLang}</Typography>
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
                <Typography style={{ fontSize: "1vw" }}>{gpsLat}</Typography>
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

     
    </Box>
  );
};

export default CameraView;
