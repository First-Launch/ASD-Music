// src/pages/EventDetailPage.tsx

import React from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Box, Button } from "@mui/material";

// Mock data for demonstration. In a real app, you'd fetch this data from an API or database.
const events = [
  {
    id: "1",
    title: "Event One",
    date: "2024-09-01",
    description: "This is the detailed description for event one. It includes all the event details and other relevant information.",
  },
  {
    id: "2",
    title: "Event Two",
    date: "2024-10-10",
    description: "This is the detailed description for event two. It includes all the event details and other relevant information.",
  },
  {
    id: "3",
    title: "Event Three",
    date: "2024-11-15",
    description: "This is the detailed description for event three. It includes all the event details and other relevant information.",
  },
];

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const event = events.find((event) => event.id === id);

  if (!event) {
    return (
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Event Not Found
          </Typography>
          <Button variant="contained" color="primary" href="/events">
            Back to Events
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          {event.title}
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          {event.date}
        </Typography>
        <Typography variant="body1" component="p" sx={{ mt: 2 }}>
          {event.description}
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 4 }} href="/events">
          Back to Events
        </Button>
      </Box>
    </Container>
  );
};

export default EventDetailPage;
