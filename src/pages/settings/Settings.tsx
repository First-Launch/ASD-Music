// src/pages/SettingsPage.tsx

import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/templates/PageLayout";

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageLayout title="Settings" showTitleBar={true}>
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
            Settings
          </Typography>
          <Typography variant="h6" component="h2" gutterBottom>
            Adjust your preferences and application settings here.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 4 }}
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Container>
    </PageLayout>
  );
};

export default SettingsPage;
