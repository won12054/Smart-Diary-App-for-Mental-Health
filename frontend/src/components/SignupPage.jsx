import React, { useState } from 'react';
import { Modal, Box } from '@mui/material';

const SignUpPage = ({ onSignUp }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!termsAccepted) {
      setShowTermsModal(true);
      return;
    }

    // Call the sign-up function with the user data
    onSignUp({ name, username, email, password }); // Include username in the signup data
  };

  const handleAcceptTerms = () => {
    setTermsAccepted(true); // Set terms as accepted
    setShowTermsModal(false); // Close the modal
  };

  const handleCloseModal = () => {
    setShowTermsModal(false); // Close the modal
  };

  return (
    <div style={styles.mainContainer}>
      <div style={styles.container}>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              required
            />
          </label>
          <label style={styles.label}>
            Username: {/* New Username Field */}
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
            />
          </label>
          <label style={styles.label}>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={termsAccepted} 
              onChange={() => setTermsAccepted(!termsAccepted)} 
            />
            I agree to the <a href="#" onClick={() => setShowTermsModal(true)} style={styles.link}>terms and conditions</a>
          </label>
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.button}>Sign Up</button>
        </form>
      </div>

      {/* Terms and Conditions Modal */}
      <Modal
        open={showTermsModal}
        onClose={handleCloseModal}
        aria-labelledby="terms-and-conditions-title"
        aria-describedby="terms-and-conditions-content"
      >
        <Box sx={styles.modalBox}>
          <h2 id="terms-and-conditions-title">Terms and Conditions</h2>
          <div style={styles.termsContent}>
            <p>Terms and Conditions</p>
            <p>Please read the terms and conditions carefully.</p>
          </div>
          <div style={styles.modalButtonContainer}>
            <button
              style={{ ...styles.button, marginTop: '20px' }}
              onClick={handleAcceptTerms}
            >
              Accept
            </button>
            <button
              style={{ ...styles.button, marginTop: '20px', backgroundColor: '#f44336' }} // Red color for the close button
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

const styles = {
  mainContainer: {
    display: 'flex',
    minHeight: '100vh',
    justifyContent: 'center', 
    alignItems: 'flex-start', 
    padding: '20px',
    margin: '0 auto',
    maxWidth: '400px'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start', 
    padding: '20px',
    width: '100%',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
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
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    marginBottom: '10px',
  },
  link: {
    color: '#4CAF50',
    textDecoration: 'none',
    marginLeft: '5px',
    cursor: 'pointer',
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
  modalBox: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '500px',
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: 24,
  },
  termsContent: {
    maxHeight: '300px',
    overflowY: 'scroll',
    border: '1px solid #ccc',
    padding: '10px',
    marginBottom: '20px',
  },
  modalButtonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
};

export default SignUpPage;
