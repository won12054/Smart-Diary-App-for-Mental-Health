import React, { useState } from 'react';
import { 
  Modal, 
  Box, 
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Checkbox,
  Link,
  Alert,
  Button
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Import services
import authService from "../services/auth-service";

const tac = `Before signing up, please review and agree to the following terms:
1. Purpose of Data Collection.
The purpose of this application is to provide a platform where users can:
•	Write and manage personal diary entries.
•	Track mental health trends and receive personalized insights.
•	Access features such as diary entries and dashboards.
2. Information We Collect.
When you register and use this application, we may collect the following information:
•	Personal Information: Name, email address, username, and password.
•	Diary Entries: Content you write in your diary, including any mental health-related data you choose to share.
3. How Your Data Will Be Used.
We respect your privacy and will use your data responsibly. Your information will be used for:
•	Providing and improving application features and functionalities.
•	Analyzing data to generate personalized insights and mental health trends.
•	Enhancing user experience and ensuring secure usage of the platform.
4. Privacy and Data Sharing.
•	Your diary entries will only be summarized locally before sharing any data externally.
•	Only the summarized text will be sent to third party for analysis. The original diary content will remain private and will not be shared outside the application.
5. Limitations of AI.
•	The AI model used in this application is designed to provide insights, but it may occasionally produce inaccurate or incomplete results.
•	This application is not a substitute for professional advice, such as medical or mental health consultation.
6. Agreement.
•	By signing up, you agree to these terms and conditions and understand the purpose and limitations of this application.
`;

const SignUpPage = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!termsAccepted) {
      setShowTermsModal(true);
      return;
    }

    // Sign Up and then Log In
    authService.signUpUser(name, username, email, password)
      .then((response) => {
        return authService.login(username, password);
      })
      .then((loginResponse) => {
        const accessToken = loginResponse.data.access_token;
        localStorage.setItem("accessToken", accessToken);
        onLogin();
      })
      .catch((e) => {
        setError('Something went wrong. Please try again!');
      });
  };

  const handleAcceptTerms = () => {
    setTermsAccepted(true); // Set terms as accepted
    setShowTermsModal(false); // Close the modal
  };

  const handleCloseModal = () => {
    setShowTermsModal(false); // Close the modal
  };

  const TermsAndConditionsModal = (
    <Modal
      open={showTermsModal}
      onClose={handleCloseModal}
      aria-labelledby="terms-and-conditions-title"
      aria-describedby="terms-and-conditions-content"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 1,
        }}
      >
        <Typography variant="h6" id="terms-and-conditions-title" mb={2}>
          Terms and Conditions
        </Typography>
        <Box sx={{
          maxHeight: 500,
          overflowY: "auto",
        }}>
          <Typography id="terms-and-conditions-content" variant="body2" mb={2} sx={{whiteSpace: "pre-line"}}>
            {tac}
          </Typography>
        </Box>
        
        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button variant="contained" color="primary" onClick={handleAcceptTerms}>
            Accept
          </Button>
          <Button variant="contained" color="error" onClick={handleCloseModal}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );


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
      }}
    >
      <Typography variant="h5" align="center" mb={3}>
        Sign Up
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <Box display="flex" alignItems="center" mt={2}>
          <Checkbox
            checked={termsAccepted}
            onChange={() => setTermsAccepted(!termsAccepted)}
          />
          <Typography>
            I agree to the <Link href="#" onClick={() => setShowTermsModal(true)}>terms and conditions</Link>
          </Typography>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          sx={{ mt: 2 }}
        >
          Sign Up
        </Button>
      </form>
      {TermsAndConditionsModal}
    </Box>
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
