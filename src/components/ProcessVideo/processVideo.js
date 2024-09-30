import React, { useState, useEffect, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
const apiUrl = process.env.REACT_APP_API_URL;
const VideoUploadAndStream = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [frames, setFrames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoProcessing, setIsVideoProcessing] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
  const ffmpeg = useRef(new FFmpeg()).current;

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

  const handleVideoUpload = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setVideoFile(event.target.files[0]);
    }
  };

  const processVideo = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("video", videoFile);
    let framesArray = []; // Array to accumulate frames
    try {
      const response = await fetch(`${apiUrl}/process-video`, {
        method: "POST",
        body: formData,
      });
      
      if (!response.body) {
        throw new Error("ReadableStream not supported or no body in response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      // Process the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const newFrames = buffer.split("\n");
        buffer = newFrames.pop(); // Keep any incomplete frame in buffer

        newFrames.forEach((frame) => {
          const parsed = JSON.parse(frame);
         
          if (parsed?.frame) setFrames((prev) => [...prev, parsed?.frame]); // Accumulate frames
        });
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error processing video:", error);
      setIsLoading(false);
    } finally {
     
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${apiUrl}/fetch_video_data`, {
        method: 'GET', // or 'POST' depending on your API
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json(); // parse the JSON from the response
     
      const headers = [
        "Id",
        "CP 1",
        "CP 2",
        "CP 3",
        "CP 4",
        "CP 5",
        "Frame Number",
        "Inclination",
        "Pantograph Height",
        "Uplift force"
        
      ];
      const csvRows = [headers.join(",")];
      result?.data?.forEach((item) => {
        const row = [
          item.id || "-",          // Handle null or undefined values
          item.cp1 || "-",
          item.cp2|| "-",
          item.cp3 || "-",
          item.cp4 || "-",
          item.cp5 || "-",
          item.frame_number || "-",
          item.inclination || "-",
          item.pantograph_height || "-",
          item.uplift_force || "-",
        
        ].join(",");
       
        csvRows.push(row);
      });
      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
  
      link.href = url;
      link.setAttribute("download", "processed_video_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
     // setError(error.message);
    } finally {
     // setLoading(false); // End loading
    }
  }
  

  const saveVideo = async () => {
    if (!ffmpegLoaded) {
      await ffmpeg.load();
    }

    setIsVideoProcessing(true);

    // Save each frame as an image file in FFmpeg's virtual file system
    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i];
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
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  useEffect(() => {
    if (videoFile) {
      processVideo();
    }
  }, [videoFile]);

  useEffect(() => {
    if (!isPaused && frames.length > 0) {
      const interval = setInterval(() => {
        setCurrentFrameIndex((prevIndex) =>
          prevIndex < frames.length - 1 ? prevIndex + 1 : prevIndex
        );
      }, 1000 / 24); // 24 frames per second

      return () => clearInterval(interval);
    }
  }, [isPaused, frames]);

  return (
    <Box sx={{ paddingTop: 10, paddingX: 5,  backgroundColor: "#333", height:"100vh" }}>
      <Typography variant="h1" color="white">Process Video</Typography>
      <Grid container >
        <Grid item xs={3}>
          <input type="file" accept="video/*" onChange={handleVideoUpload} />
        </Grid>

        <Grid item xs={5}>
          {frames.length > 0 && (
            <Box marginY={1}>
             
               <Button variant="outlined" onClick={togglePause} sx={{marginRight:3,background:"white"}}>
                {isPaused ? "Resume" : "Pause"}
              </Button>
              {!isLoading && <Button
              sx={{background:"white"}}
                variant="outlined"
                onClick={fetchData}
                disabled={isVideoProcessing}
              >
               Download Report
              </Button>}
             {!isVideoProcessing  && <Button
                variant="outlined"
                onClick={saveVideo}
                sx={{background:"white"}}
                disabled={isVideoProcessing}
              >
                Save Video
              </Button>}
              {isVideoProcessing && frames?.length < 0 && (
                <CircularProgress />
              )}
              {videoUrl && (
            <a href={videoUrl} download="processed_video.mp4">
              <Button variant="contained" color="primary" sx={{marginLeft:3,background:"white"}}>
                Download Video
              </Button>
            </a>
          )}
            </Box>
          )}
        </Grid>
      
      </Grid>

      {frames.length > 0 ? (
  <img
    src={`data:image/jpeg;base64,${frames[currentFrameIndex]}`}
    alt="Stream frame"
    style={{ width: "auto", height: "70vh" }} // Display the latest frame
  />
) : (
  <Box
    sx={{
      width: "50%",
      height: "70vh",
      border: "2px dashed red",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
   
  </Box>
)}

    </Box>
  );
};

export default VideoUploadAndStream;
