import React, { useState, useEffect, useRef } from 'react';
import authService from "../services/auth-service";
import NET from 'vanta/dist/vanta.net.min';
import * as THREE from 'three';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // const vantaRef = useRef(null); // Reference for the Vanta background

  // useEffect(() => {
  //   const vantaEffect = NET({
  //     el: vantaRef.current,
  //     THREE,
  //     color: 0xffd700,          // Gold color for the net lines
  //     backgroundColor: 0x013220, // Dark green background
  //     maxDistance: 20.0,
  //     points: 10.0,
  //   });

  //   // Cleanup effect on unmount
  //   return () => {
  //     if (vantaEffect) vantaEffect.destroy();
  //   };
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    authService.login(username, password)
      .then((response) => {
        const accessToken = response.data.access_token;
        localStorage.setItem("accessToken", accessToken);
        return authService.getUserInfo(accessToken);
      })
      .then((userInfoResponse) => {
        onLogin(userInfoResponse.data);
      })
      .catch((e) => {
        setError('Invalid username or password');
      });
  };

  // return (
  //   <div ref={vantaRef} style={styles.vantaBackground}> {/* Apply Vanta to this div */}
  //     <div style={styles.container}>
  //     <h2 style={styles.heading}>Login</h2>
  //       <form onSubmit={handleSubmit} style={styles.form}>
  //         <label style={styles.label}>
  //           Username:
  //           <input
  //             type="text"
  //             value={username}
  //             onChange={(e) => setUsername(e.target.value)}
  //             style={styles.input}
  //             required
  //           />
  //         </label>
  //         <label style={styles.label}>
  //           Password:
  //           <input
  //             type="password"
  //             value={password}
  //             onChange={(e) => setPassword(e.target.value)}
  //             style={styles.input}
  //             required
  //           />
  //         </label>
  //         <button type="submit" style={styles.button}>Login</button>
  //         {error && <p style={styles.error}>{error}</p>}
  //       </form>
  //       <p style={styles.registerText}>
  //         Don't have an account?{' '}
  //         <a href="/register" style={styles.registerLink}>Register</a>
  //       </p>
  //     </div>
  //   </div>
  // );
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
      <p style={styles.registerText}>
        Don't have an account?{' '}
        <a href="/register" style={styles.registerLink}>Register</a>
      </p>
    </div>
    
  );
};
const styles = {
  vantaBackground: {
    width: '100%',
    height: '100vh',
    position: 'relative',
    overflow: 'hidden',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    height: '100vh',
    margin: '0 auto',
    maxWidth: '400px',
    backgroundColor: 'rgba(255, 255, 255, 0.25)', // Slightly more opaque for better contrast
    borderRadius: '16px',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(10px)',
    zIndex: 1,
  },
  heading: {
    color: '#ffffff', // White color for visibility
    fontWeight: 'bold', // Bold font for emphasis
    fontSize: '24px', // Slightly larger font for prominence
    marginBottom: '20px', // Space below the heading
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '100%', // Set to 100% to take full container width
    width: '100%', // Ensures consistency
    boxSizing: 'border-box', // Prevents padding from affecting width
  },
  label: {
    marginBottom: '10px',
    fontWeight: '500',
    // color: '#f1f1f1', // Lighter color for better visibility on dark background
    color: 'black'
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
    color: '#333', // Dark color for input text
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Opaque for readability
    boxSizing: 'border-box',
  },
  button: {
    width: '100%', // Matches input width
    padding: '12px', // Matches input padding for consistent size
    borderRadius: '8px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
    boxSizing: 'border-box', // Ensures consistent box sizing
  },
  buttonHover: {
    backgroundColor: '#45a049',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
  registerText: {
    marginTop: '10px',
  },
  registerLink: {
    color: '#4CAF50',
    textDecoration: 'none',
  },
};

export default LoginPage;
