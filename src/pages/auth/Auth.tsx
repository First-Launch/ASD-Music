// src/pages/auth/AuthPage.tsx

import React, { useEffect } from "react";
import { Container, CssBaseline, Box, Typography, Link } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import SignInSignUp from "../../components/auth/Auth";
import { useAuth } from "../../contexts/AuthContext";

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
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h4">
          Welcome to MyApp
        </Typography>
        <Typography component="h2" variant="h6" color="textSecondary" sx={{ mt: 1, mb: 4 }}>
          Please sign in or sign up to continue
        </Typography>
        <SignInSignUp />
        <Box mt={5}>
          <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://yourwebsite.com/">
              YourWebsite
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default AuthPage;
