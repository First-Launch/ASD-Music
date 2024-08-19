// src/App.tsx

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/home/Home";
import AuthPage from "./pages/auth/Auth";
import DashboardPage from "./pages/dashboard/Dashboard";
import ProfilePage from "./pages/profile/Profile";
import SettingsPage from "./pages/settings/Settings";
import MusicLibraryPage from "./pages/music/MusicLibrary"; // Import the music library page
import AboutPage from "./pages/about/About";
import NotFoundPage from "./pages/notFound/NotFound";
import NavBar from "./components/nav/NavBar";
import { useAuth } from "./contexts/AuthContext";
import InstrumentsInventoryPage from "./pages/instruments/InstrumentsInventoryPage";
import './App.css';  // Ensure this line is here to import your CSS

function App() {
  const { isAuthenticated } = useAuth();

  return (
    // <div className="container">
    <Router>
      <NavBar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/auth?referrer=/dashboard" />} />
        <Route path="/dashboard/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/auth?referrer=/dashboard/profile" />} />
        <Route path="/dashboard/settings" element={isAuthenticated ? <SettingsPage /> : <Navigate to="/auth?referrer=/dashboard/settings" />} />
        <Route path="/dashboard/music" element={isAuthenticated ? <MusicLibraryPage /> : <Navigate to="/auth?referrer=/dashboard/music" />} />
        <Route path="/dashboard/instruments" element={isAuthenticated ? <InstrumentsInventoryPage /> : <Navigate to="/auth?referrer=/dashboard/instruments" />} />

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
    // </div>
  );
}

export default App;
