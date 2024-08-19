// src/components/SignInSignUp.tsx

import React, { useState } from "react";
import { Container, TextField, Button, Box, Typography, Grid, Link } from "@mui/material";
import { signInWithEmailAndPasswordFunc, signUpWithEmailAndPassword, signInWithGoogle } from "../../services/authService";

const SignInSignUp = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (isSignUp) {
      await signUpWithEmailAndPassword(email, password);
    } else {
      await signInWithEmailAndPasswordFunc(email, password);
    }
  };

  const toggleMode = () => {
    setIsSignUp((prev) => !prev);
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          {isSignUp ? "Sign Up" : "Sign In"}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            onClick={signInWithGoogle}
          >
            Sign in with Google
          </Button>
          <Grid container>
            <Grid item>
              <Link href="#" variant="body2" onClick={toggleMode}>
                {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default SignInSignUp;
