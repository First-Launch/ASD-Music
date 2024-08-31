import React, { useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import PageHead from "../../components/Header";
import PageLayout from "../../components/templates/PageLayout";

const HomePage: React.FC = () => {
  const placeholderText =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
  const [isLoading, setIsLoading] = useState(false); // State to control loading spinner
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  var actions: React.ReactNode;

  // Define the refresh handler function
  const handleRefresh = () => {
    console.log("Refreshing data...");
    setIsLoading(true); // Set loading state to true

    // Simulate a data refresh with a timeout
    setTimeout(() => {
      setIsLoading(false); // Set loading state to false after refresh
      console.log("Data refreshed!");
    }, 1000); // Simulate a 1-second refresh delay
  };

  return (
    <PageLayout
      title="Home"
      showTitleBar={true}
      refreshable={true}
      refreshHandler={handleRefresh}
      isLoading={isLoading} // Pass the loading state to PageLayout
      actions={actions}
    >
      <PageHead backgroundImage="/assets/home_header.jpg" title="ASD Music" />
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom sx={{ mt: 4 }}>
            Who are we?
          </Typography>
          <Typography variant="body1" gutterBottom>
            {placeholderText}
          </Typography>

          <Typography variant="h2" component="h1" gutterBottom sx={{ mt: 4 }}>
            Our Groups
          </Typography>
          <Typography variant="body1" gutterBottom>
            {placeholderText}
          </Typography>

          <Typography variant="h2" component="h1" gutterBottom sx={{ mt: 4 }}>
            Events
          </Typography>
          <Typography variant="body1" gutterBottom>
            {placeholderText}
          </Typography>

          <Typography variant="h2" component="h1" gutterBottom sx={{ mt: 4 }}>
            Our Conductor
          </Typography>
          <Typography variant="body1" gutterBottom>
            {placeholderText}
          </Typography>

          <Typography variant="h2" component="h1" gutterBottom sx={{ mt: 4 }}>
            A Message from our Conductor
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ mb: 8 }}>
            {placeholderText}
          </Typography>
        </Box>
      </Container>
    </PageLayout>
  );
};

export default HomePage;
