// src/pages/about/About.tsx

import React from "react";
import { Container, Typography, Box } from "@mui/material";

const AboutPage: React.FC = () => {
  return (
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
          About Us
        </Typography>
        <Typography variant="body1" align="center" sx={{ mt: 2 }}>
          Welcome to MyApp! We are dedicated to providing you with the best experience possible.
          Our platform is designed to help you manage your tasks efficiently and effectively.
        </Typography>
        <Typography variant="body1" align="center" sx={{ mt: 2 }}>
          Our mission is to make your life easier by offering tools that help you stay organized
          and productive. Whether you're working on a project, managing a team, or just trying to
          keep track of your daily tasks, we've got you covered.
        </Typography>
        <Typography variant="body1" align="center" sx={{ mt: 2 }}>
          Thank you for choosing MyApp. We hope you enjoy using our platform as much as we enjoy
          building it for you!
        </Typography>
      </Box>
    </Container>
  );
};

export default AboutPage;
