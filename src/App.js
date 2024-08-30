import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout.js';
import Home from './components/Home.js';
import Camera from './components/LiveTracking/CameraView.js';
import GPS from './components/Settings/GPSView.js';
import theme from './theme/theme.js';
import { ThemeProvider } from '@mui/material/styles/index.js';
import Reports from './components/Reports.js';
import CameraSettings from './components/Settings/CameraSettings.js';
import RouteManagement from './components/Data Master/Route.js';
import SectionManagement from './components/Data Master/Section.js';
import SparkDataView from './components/Reports/ViewSparkData.js';
import UploadRouteData from './components/Data Master/UploadRoute.js';
import DistanceSensor from './components/Settings/DistanceSensor.js';
import TechoSensor from './components/Settings/TechoSensor.js';
import VideoUploadAndStream from './components/ProcessVideo/processVideo.js';
const App = () => {
    return (
      <ThemeProvider theme={theme}>
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="camera" element={<Camera />} />
                    <Route path="gps" element={<GPS />} />
                    <Route path="camera-settings" element={<CameraSettings />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="route-management" element={<RouteManagement />} />
                    <Route path="section-management" element={<SectionManagement />} />
                    <Route path="spark-data-view" element={<SparkDataView />} />
                    <Route path="upload-route-data" element={<UploadRouteData />} />
                    <Route path="distance-sensor" element={<DistanceSensor />} />
                    <Route path="tacho-sensor" element={<TechoSensor />} />
                    <Route path="process-video" element={<VideoUploadAndStream />} />
                </Route>
            </Routes>
        </Router>
      </ThemeProvider>
    );
};

export default App;
