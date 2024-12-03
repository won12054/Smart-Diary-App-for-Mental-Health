import React, { useState, useEffect } from 'react';
import { Paper, Box, TextField, Button, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

// Import services
import authService from "../services/auth-service";

const ProfilePage = ({userId, oldName, oldUsername, oldEmail, onUpdate, onLogout}) => {
  const UNAUTHORIZED_LOGOUT_MESSAGE = "Token expired. Please log in again!";

  const [error, setError] = useState('');

  const [profile, setProfile] = useState({
    id: userId,
    name: oldName,
    username: oldUsername,
    email: oldEmail,
    newPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Handle save action, e.g., API call to save profile
    authService.updateUserInfo(profile)
    .then((response) => {
      const accessToken = response.data.access_token;
      localStorage.setItem("accessToken", accessToken);
      onUpdate();
    })
    .catch((e) => {
      setError('Something went wrong. Please try again!');
      if (e.response && e.response.status === 401) {
        onLogout(UNAUTHORIZED_LOGOUT_MESSAGE);
      }
    });
  };
  
  return (
    <Paper sx={{ p: 3, m: 15, mt: 0 }}>
      <Typography variant="h5" align="center" mb={3}>
        Edit Profile
      </Typography>
      <TextField
        label="Name"
        name="name"
        value={profile.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Username"
        name="username"
        value={profile.username}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        name="email"
        value={profile.email}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="New Password (leave empty to keep old password)"
        name="newPassword"
        value={profile.newPassword}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      {error && <p style={styles.error}>{error}</p>}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        startIcon={<SaveIcon />}
        onClick={handleSave}
        sx={styles.saveButton}
      >
        Save
      </Button>
    </Paper>
  );
}

const styles = {
  saveButton: {
    mt: 2,
    padding: '10px 20px', 
    fontSize: '16px',
    textTransform: 'none',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
}

export default ProfilePage;