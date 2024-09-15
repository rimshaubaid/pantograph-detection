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
          if (frame) setFrames((prev) => [...prev, frame]); // Accumulate frames
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error processing video:", error);
      setIsLoading(false);
    }
  };

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
    <Box sx={{ paddingTop: 10, paddingX: 5 }}>
      <Typography variant="h1">Process Video</Typography>
      <Grid container >
        <Grid item xs={3}>
          <input type="file" accept="video/*" onChange={handleVideoUpload} />
        </Grid>

        <Grid item xs={5}>
          {frames.length > 0 && (
            <Box marginY={1}>
             
               <Button variant="outlined" onClick={togglePause} sx={{marginRight:3}}>
                {isPaused ? "Resume" : "Pause"}
              </Button>
             {!isVideoProcessing  && <Button
                variant="outlined"
                onClick={saveVideo}
                disabled={isVideoProcessing}
              >
                Save Video
              </Button>}
              {isVideoProcessing && frames?.length < 0 && (
                <CircularProgress />
              )}
              {videoUrl && (
            <a href={videoUrl} download="processed_video.mp4">
              <Button variant="contained" color="primary" sx={{marginLeft:3}}>
                Download Video
              </Button>
            </a>
          )}
            </Box>
          )}
        </Grid>
      
      </Grid>

      {frames.length > 0 && (
        <img
          src={`data:image/jpeg;base64,${frames[currentFrameIndex]}`}
          alt="Stream frame"
          style={{ width: "auto", height: "70vh" }} // Display the latest frame
        />
      )}
    </Box>
  );
};

export default VideoUploadAndStream;
