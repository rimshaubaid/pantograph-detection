import React, { useState, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { Box, Button } from "@mui/material";

const VideoUploadAndStream = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [frames, setFrames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoProcessing, setIsVideoProcessing] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  const ffmpeg = new FFmpeg({ log: true });

  const handleVideoUpload = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setVideoFile(event.target.files[0]);
    }
  };

  const processVideo = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("video", videoFile);

    try {
      const response = await fetch("http://81.208.170.168:5100/process-video", {
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
    await ffmpeg.load();

    setIsVideoProcessing(true);

    // Save each frame as an image file in FFmpeg's virtual file system
    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i];
      ffmpeg.writeFile(`frame${i}.jpg`, await fetchFile(`data:image/jpeg;base64,${frame}`));
    }

    // Create a video from the frames using FFmpeg
    await ffmpeg.run(
      "-framerate", "24", // You can adjust the frame rate
      "-i", "frame%d.jpg", // Input pattern for frames
      "-c:v", "libx264",
      "-pix_fmt", "yuv420p",
      "output.mp4"
    );

    const data = ffmpeg.readFile("output.mp4");

    // Use the toBlobURL utility to generate a blob URL for downloading the video
    const videoBlobUrl = toBlobURL(new Blob([data.buffer], { type: "video/mp4" }));
    setVideoUrl(videoBlobUrl);

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
    <Box sx={{ paddingTop: 7, paddingX: 5 }}>
      <h1>Process Video</h1>
      <input type="file" accept="video/*" onChange={handleVideoUpload} />

      {isLoading && frames?.length < 0 && <p>Processing video, please wait...</p>}
      {frames.length > 0 && (
        <Box marginY={1}>
          {/* <Button onClick={saveVideo}>Save Video</Button> */}
          <Button variant="outlined" onClick={togglePause}>{isPaused ? "Resume" : "Pause"}</Button>
        </Box>
      )}

      {/* {isVideoProcessing && <p>Saving video, please wait...</p>} */}

      {videoUrl && (
        <a href={videoUrl} download="processed_video.mp4">
          <Button variant="contained" color="primary">
            Download Video
          </Button>
        </a>
      )}

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
