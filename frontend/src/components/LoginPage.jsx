import React, { useState } from 'react';
import authService from "../services/auth-service";
import { Link, Box, TextField, Button, Typography, Alert, InputAdornment, IconButton, OutlinedInput } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    authService.login(username, password)
      .then((response) => {
        const accessToken = response.data.access_token;
        localStorage.setItem("accessToken", accessToken);
        onLogin();
      })
      .catch((e) => {
        setError('Invalid username or password');
      });
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: 'auto',
        width: '100%',
        mt: 3,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: 'white'
      }}
    >
      <Typography variant="h5" align="center" mb={3}>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        <Typography align='center' sx={{ my: 1 }}>
          Don't have an account? <Link href="/register" underline="hover">Register Here</Link>
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          sx={{ mt: 1 }}
        >
          Login
        </Button>
      </form>
    </Box>
  );
};

export default LoginPage;
