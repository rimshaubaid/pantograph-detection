import React from "react";
import { Box } from "@mui/material";
import HomeImg from "../assets/images/home.jpeg";
const Home = () => {
  return (
    <Box sx={{ paddingTop: 7 }}>
      <img src={HomeImg} />
    </Box>
  );
};

export default Home;
