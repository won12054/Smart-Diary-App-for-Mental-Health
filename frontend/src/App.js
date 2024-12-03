// Import React
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import components
import DiaryPage from './components/DiaryPage';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ProfilePage from './components/ProfilePage';
import AdminPage from './components/AdminPage'; // Admin page component
import LoginPage from './components/LoginPage'; // Import the login page component
import SignUpPage from './components/SignupPage'; // Import the signup page component
import authService from "./services/auth-service";

// Import styles
import './styles/App.css';

// Import mui components
import { Box, Container, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Snackbar, Alert } from '@mui/material';

import '@fontsource/poppins';

const App = () => {
  const DEFAULT_LOGOUT_MESSAGE = "You have successfully logged out.";

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState(DEFAULT_LOGOUT_MESSAGE);

  const setUserInfo = () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      (async () => {
        const response = await authService.getUserInfo();
        const userInfo = response.data;
        setUserRole(userInfo["role"]);
        setUserId(userInfo["_id"]);
        setName(userInfo["full_name"]);
        setUsername(userInfo["username"]);
        setEmail(userInfo["email"]);
        setIsLoggedIn(true);
      }
    )()};
  }

  useEffect(() => {
    setUserInfo();
  }, [setUserInfo]);

  const handleLogout = (msg) => {
    localStorage.removeItem('accessToken');
    setUserRole(null);
    setUserId("");
    setName("");
    setUsername("");
    setEmail("");
    setIsLoggedIn(false);
    if (typeof msg === 'string') {
      setLogoutMessage(msg);
    } else {
      setLogoutMessage(DEFAULT_LOGOUT_MESSAGE);
    }
    setOpenSnackbar(true); // Open Snackbar with message
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return; // Keep it open if clicked outside
    setOpenSnackbar(false); // Close Snackbar on manual dismiss
  };


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={styles.box}>
          <Header 
            username={username} 
            userRole={userRole}
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            />
        
          <Container sx={styles.container}>
            <Routes>
              {isLoggedIn ? (
                <>
                  <Route path="/admin" element={userRole === 'admin' ? <AdminPage onLogout={handleLogout}/> : <Navigate to="/" />} />
                  <Route path="/" element={userRole !== 'admin' ? <Dashboard onLogout={handleLogout}/> : <Navigate to="/admin" />} />
                  <Route path="/diary" element={<DiaryPage userId={userId} onLogout={handleLogout}/>} />
                  <Route path="/profile" 
                    element={
                    <ProfilePage 
                      userId={userId} 
                      oldName={name} 
                      oldUsername={username} 
                      oldEmail={email}
                      onUpdate={setUserInfo}
                      onLogout={handleLogout}
                      />
                  } />
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              ) : (
                <>
                  <Route path="/" element={<LoginPage onLogin={setUserInfo} />} />
                  <Route path="/register" element={<SignUpPage onLogin={setUserInfo} />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              )}
            </Routes>
          </Container>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000} // Hide after 3 seconds
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
              {logoutMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Router>
    </ThemeProvider>
  );

};

const theme = createTheme({
  typography: {
    fontFamily: "'Poppins', sans-serif",
  },
  palette: {
    primary: {
      main: '#008080', // Soft Teal for AppBar and primary color
    },
    background: {
      default: '#f0f7f4', // Optional: background color for a calming effect
    },
  },
});

const styles = {
  box: {
    display: 'flex', 
    flexDirection: 'column',
    minHeight: '100vh',
  },
  container: {
    flexGrow: 1, 
    mt: 4
  }
};

export default App;
