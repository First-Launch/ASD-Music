// src/pages/EventsPage.tsx

import React from "react";
import { Container, Typography, Box, Grid, Card, CardContent, CardActions, Button } from "@mui/material";

const events = [
  {
    id: 1,
    title: "Event One",
    date: "2024-09-01",
    description: "This is the description for event one.",
  },
  {
    id: 2,
    title: "Event Two",
    date: "2024-10-10",
    description: "This is the description for event two.",
  },
  {
    id: 3,
    title: "Event Three",
    date: "2024-11-15",
    description: "This is the description for event three.",
  },
];

const EventsPage: React.FC = () => {
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
          Upcoming Events
        </Typography>
        <Grid container spacing={4}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {event.title}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {event.date}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {event.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default EventsPage;
