import React, { useState, useEffect } from "react";
import axios from "axios";

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
    if (!videoFile) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append("video", videoFile);

    try {
      const response = await axios.post("http://127.0.0.1:5000/process-video", formData);
      setFrames(response.data); // Assuming API returns base64 frames in an array
    } catch (error) {
      console.error("Error processing video:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (videoFile) {
      processVideo();
    }
  }, [videoFile]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Video Upload and Live Streaming</h1>
      <input type="file" accept="video/*" onChange={handleVideoUpload} />
      
      {isLoading && <p>Processing video, please wait...</p>}
      
      {frames.length > 0 && (
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
              src={`data:image/jpeg;base64,${frame}`}
              alt={`Frame ${index}`}
              style={{
                width: "100%",
                height: "auto",
                display: index === frames.length - 1 ? "block" : "none", // Show only the latest frame
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoUploadAndStream;
