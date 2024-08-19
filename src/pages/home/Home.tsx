// src/pages/HomePage.tsx

import React from "react";
import { Container, Typography, Box } from "@mui/material";
import PageHead from "../../components/Header";

const HomePage: React.FC = () => {
  var placeholderText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  return (
    <>
      <PageHead backgroundImage="/assets/home_header.jpg" title="ASD Music" />
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >

          <Typography variant="h2" component="h1" gutterBottom sx={{ mt: 4 }}>Who are we?</Typography>
          <Typography variant="body1" gutterBottom align="center">
            {placeholderText}
          </Typography>


          <Typography variant="h2" component="h1" gutterBottom sx={{ mt: 4 }}>Our Groups</Typography>
          <Typography variant="body1" gutterBottom align="center">
            {placeholderText}
          </Typography>

          <Typography variant="h2" component="h1" gutterBottom sx={{ mt: 4 }}>Events</Typography>
          <Typography variant="body1" gutterBottom align="center">
            {placeholderText}
          </Typography>

          <Typography variant="h2" component="h1" gutterBottom sx={{ mt: 4 }}>Our Conductor</Typography>
          <Typography variant="body1" gutterBottom align="center">
            {placeholderText}
          </Typography>

          <Typography variant="h2" component="h1" gutterBottom sx={{ mt: 4 }}>A Message from our Conductor</Typography>
          <Typography variant="body1" gutterBottom align="center" sx={{ mb: 8 }}>
            {placeholderText}
          </Typography>
        </Box>
      </Container>
    </>

  );
};

export default HomePage;
