import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Home } from "@mui/icons-material";
const Navbar = () => {
  const [anchorElSettings, setAnchorElSettings] = useState(null);
  const [anchorElDataMaster, setAnchorElDataMaster] = useState(null);
  const [anchorElReports, setAnchorElReports] = useState(null);

  const openSettings = Boolean(anchorElSettings);
  const openDataMaster = Boolean(anchorElDataMaster);
  const openReports = Boolean(anchorElReports);

  const handleClickSettings = (event) => {
    setAnchorElSettings(event.currentTarget);
  };

  const handleClickDataMaster = (event) => {
    setAnchorElDataMaster(event.currentTarget);
  };

  const handleClickReports = (event) => {
    setAnchorElReports(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElSettings(null);
    setAnchorElDataMaster(null);
    setAnchorElReports(null);
  };

  return (
    <AppBar position="absolute" >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          ATAI
        </Typography>
        <Button color="inherit" component={Link} to="/">
          <Home />
        </Button>

        <Button color="inherit" component={Link} to="/camera">
          Live Pantograph Detection
        </Button>

        <Button color="inherit" component={Link} to="/process-video">
         Process Video
        </Button>

        {/* Settings Button */}
        <Button color="inherit" onClick={handleClickSettings}>
          Settings
        </Button>
        <Menu
          anchorEl={anchorElSettings}
          open={openSettings}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: 48 * 4.5,
            },
          }}
        >
          <MenuItem
            component={Link}
            to="/camera-settings"
            onClick={handleClose}
          >
            Camera
          </MenuItem>
          <MenuItem component={Link} to="/gps" onClick={handleClose}>
            GPS
          </MenuItem>
          <MenuItem component={Link} to="/distance-sensor" onClick={handleClose}>
           Distance Sensor
          </MenuItem>
          <MenuItem component={Link} to="/tacho-sensor" onClick={handleClose}>
           Tacho Sensor
          </MenuItem>
        </Menu>

        {/* Data Master Button */}
        <Button color="inherit" onClick={handleClickDataMaster}>
          Data Master
        </Button>
        <Menu
          anchorEl={anchorElDataMaster}
          open={openDataMaster}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: 48 * 4.5,
            },
          }}
        >
          <MenuItem
            component={Link}
            to="/route-management"
            onClick={handleClose}
          >
            Create/Edit Route
          </MenuItem>
          <MenuItem
            component={Link}
            to="/section-management"
            onClick={handleClose}
          >
            Create/Edit Section
          </MenuItem>
          <MenuItem
            component={Link}
            to="/upload-route-data"
            onClick={handleClose}
          >
            Upload Route Data
          </MenuItem>
        </Menu>

        {/* Reports Button */}
        <Button color="inherit" onClick={handleClickReports}>
          Reports
        </Button>
        <Menu
          anchorEl={anchorElReports}
          open={openReports}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: 48 * 4.5,
            },
          }}
        >
          <MenuItem component={Link} to="spark-data-view" onClick={handleClose}>
            View Data
          </MenuItem>
         
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
