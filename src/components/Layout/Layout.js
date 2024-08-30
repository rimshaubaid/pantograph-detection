import React from "react";
import Navbar from "../Navbar/Navbar.js";
import { Container, Box, Grid } from "@mui/material";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <Grid sx={{overflow:"hidden",height:"100vh"}}>
      <Navbar />
    
        <Outlet />
  
    </Grid>
  );
};

export default Layout;
