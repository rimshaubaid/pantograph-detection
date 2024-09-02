import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box } from "@mui/material";

const VideoUploadAndStream = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [frames, setFrames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleVideoUpload = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setVideoFile(event.target.files[0]);
    }
  };
  const processVideo = async () => {
    setIsLoading(true);

    const formData = new FormData();
    // Replace with your actual video file or handle it via user input
    formData.append("video", videoFile); // Ensure videoFile is defined

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
      let buffer = '';

      // Process the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
       // console.log('buffer',buffer)
        // Split buffer by newlines to get frames
        const frames = buffer.split('\n');
        buffer = frames.pop(); // Keep any incomplete frame in buffer

        frames.forEach(frame => {
          if (frame) setFrames(frame); // Update state with new frame
        });
      }

      setIsLoading(false);

    } catch (error) {
      console.error('Error processing video:', error);
      setIsLoading(false);
    }
  };

  
  
  

  useEffect(() => {
    if (videoFile) {
      processVideo();
    }
  }, [videoFile]);
  //console.log('f',frames)
  return (
    <Box sx={{ paddingTop:7, paddingX:5}}>
      <h1>Process Video</h1>
      <input type="file" accept="video/*" onChange={handleVideoUpload} />
      
      {isLoading && <p>Processing video, please wait...</p>}
      {frames && 
          <img
            src={`data:image/jpeg;base64,${frames}`}
            alt="Stream frame"
            style={{ width: 'auto', height: '70vh' }} // Adjust styling as needed
          />}
      {/* {frames.length > 0 && (
        <div
          style={{
            width: "100%",
            height: "500px",
            overflow: "hidden",
            border: "2px solid #000",
            marginTop: "20px",
          }}
        >
          {frames.map((frame, index) => (
            <img
              key={index}
              src={frame}
              alt={`Frame ${index}`}
              style={{
                width: "100%",
                height: "auto",
                display: index === frames.length - 1 ? "block" : "none", // Show only the latest frame
              }}
            />
          ))} 
        </div>
            )}*/}
    </Box>
  );
};

export default VideoUploadAndStream;
