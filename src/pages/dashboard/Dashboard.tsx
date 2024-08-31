import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import PageLayout from "../../components/templates/PageLayout";

const DashboardPage: React.FC = () => {
  const { isAuthenticated, logout, currentUser } = useAuth(); // Access authentication context

  const navigate = useNavigate();

  const handleGoToProfile = () => {
    navigate("/dashboard/profile");
  };

  const handleGoToSettings = () => {
    navigate("/dashboard/settings");
  };

  return (
    <PageLayout title="Dashboard" showTitleBar={true}>
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            mt: 8,
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Welcome to your dashboard! Manage your profile, settings, and more.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 4 }}
            onClick={handleGoToProfile}
          >
            Go to Profile
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 4 }}
            onClick={logout}
          >
            Logout
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            sx={{ mt: 2 }}
            onClick={handleGoToSettings}
          >
            Go to Settings
          </Button>
        </Box>
      </Container>
    </PageLayout>
  );
};

export default DashboardPage;
