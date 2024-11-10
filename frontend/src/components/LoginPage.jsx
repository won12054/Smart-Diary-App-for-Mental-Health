import React, { useState } from 'react';

// Import services
import authService from "../services/auth-service";
import { responsiveFontSizes } from '@mui/material';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    authService.login(username, password)
    .then((response) => {
      console.log(response.data);
      const accessToken = response.data.access_token;
      localStorage.setItem("access_token", accessToken);

      return authService.getUserInfo(accessToken);
    })
    .then((userInfoResponse) => {
      console.log(userInfoResponse.data);
      const role = userInfoResponse.data["role"];
      onLogin(role)
    })
    .catch((e) => {
      console.log(e);
      setError('Invalid username or password');
    });

  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />
        </label>
        <label style={styles.label}>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
        </label>
        <button type="submit" style={styles.button}>Login</button>
        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start', 
    padding: '20px',
    height: '100vh', 
    margin: '0 auto',
    maxWidth: '400px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '300px',
    width: '100%',
  },
  label: {
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    borderRadius: '4px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
};

export default LoginPage;
