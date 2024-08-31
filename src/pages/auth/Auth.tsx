// src/pages/auth/AuthPage.tsx

import React, { useEffect } from "react";
import { Container, CssBaseline, Box, Typography, Link, IconButton } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import SignInSignUp from "../../components/auth/Auth";
import { useAuth } from "../../contexts/AuthContext";
import PageLayout from "../../components/templates/PageLayout";
import { Home } from "@mui/icons-material";

const AuthPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const referrer = searchParams.get("referrer");

  useEffect(() => {
    if (isAuthenticated) {
      navigate(referrer || "/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate, referrer]);

  return (
    <PageLayout title="Login"
      actions={
        <IconButton edge="start" color="inherit" aria-label="home" onClick={() => navigate("/")}>
          <Home />
        </IconButton>
      }>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h2" variant="h6" color="textSecondary" sx={{ mb: 1 }}>
            Please sign in or sign up to continue
          </Typography>
          <SignInSignUp />
          <Box mt={5}>
            <Typography variant="body2" color="textSecondary" align="center">
              {'Copyright © '}
              <Link color="inherit" href="https://firstlaunch.dev">
                First Launch Developments
              </Link>{' '}
              {'and Byron Ojua-Nice, '}
              {new Date().getFullYear()}
              {'.'}
            </Typography>
          </Box>
        </Box>
      </Container>
    </PageLayout>
  );
};

export default AuthPage;
