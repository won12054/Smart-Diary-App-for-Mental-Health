import React, { useEffect, useState } from 'react';
import {saveAs} from 'file-saver';
import { 
  Box, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Modal
} from '@mui/material';

// Import services
import adminService from '../services/admin-service';

const AdminPage = ({ onLogout }) => {
  const UNAUTHORIZED_LOGOUT_MESSAGE = "Token expired. Please log in again!";

  const [users, setUsers] = useState([]);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isResetPopupOpen, setIsResetPopupOpen] = useState(false);
  const [resetUserId, setResetUserId] = useState(null);

  useEffect(() => {
    adminService.getUsers()
    .then((response) => {
      setUsers(response.data);
    })
    .catch((e) => {
      console.log(e);
      if (e.response && e.response.status === 401) {
        onLogout(UNAUTHORIZED_LOGOUT_MESSAGE);
      }
    });
  }, []);

  // Delete user function
  const handleDelete = () => {
    if (deleteUserId) {
      adminService.deleteUser(deleteUserId)
      .then((response) => {
        // do things
      })
      .catch((e) => {
        console.log(e);
        if (e.response && e.response.status === 401) {
          onLogout(UNAUTHORIZED_LOGOUT_MESSAGE);
        }
      });
      setIsDeletePopupOpen(false);
      setDeleteUserId(null);
    }
  };

  const confirmDelete = (userId) => {
    setDeleteUserId(userId);
    setIsDeletePopupOpen(true);
  }

  //Password reset
  const handleResetPassword = () => {
    if (resetUserId) {
      // give userId and new password
      adminService.resetPassword(resetUserId, "secret")
      .then((response) => {
        // do things
      })
      .catch((e) => {
        console.log(e);
        if (e.response && e.response.status === 401) {
          onLogout(UNAUTHORIZED_LOGOUT_MESSAGE);
        }
      });
      setIsResetPopupOpen(false);
      setResetUserId(null);
    }
  }

  const confirmReset = (userId) => {
    setResetUserId(userId);
    setIsResetPopupOpen(true);
  }

  // Export user report
  const handleExport = () => {
    const csvHeader = [
      'User ID,Username,Anxiety Count,Depression Count,Bipolar Count,Suicide Count,Other Count\n'
    ];
    
    // Map user data to rows
    const csvRows = users.map(user => 
      `${user.user_id},${user.username},${user.anxiety_count},${user.depression_count},${user.bipolar_count},${user.suicide_count},${user.other_count}`
    );
  
    // Combine header and rows into a single Blob
    const csvData = new Blob(
      [csvHeader + csvRows.join('\n')], 
      { type: 'text/csv;charset=utf-8;' }
    );
  
    // Trigger download
    saveAs(csvData, 'UserReport.csv');
  };

  /*
  anxiety_count: 2
​​
  bipolar_count: 1
  ​​
  depression_count: 3
  ​​
  other_count: 1
  ​​
  suicide_count: 6
  ​​
  user_id: "69b02b85-4141-4a42-a15c-7437e2eab455"
  ​​
  username: "pak"
  */

  const DeleteModal = (
    <Modal
      open={isDeletePopupOpen}
      onClose={() => setIsDeletePopupOpen(false)}
    >
      <Box sx={styles.modalBox}>
        <Typography variant="h6" component="h2" align="center">
          Are you sure you want to delete this user?
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-around' }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleDelete}
            sx={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#4CAF50' }}
          >
            Delete
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => setIsDeletePopupOpen(false)}
            sx={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#f44336' }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );

  const ResetModal = (
    <Modal
      open={isResetPopupOpen}
      onClose={() => setIsResetPopupOpen(false)}
    >
      <Box sx={styles.modalBox}>
        <Typography variant="h6" component="h2" align="center">
          Are you sure you want to reset password for this user?
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-around' }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleResetPassword}
            sx={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#4CAF50' }}
          >
            Reset
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => setIsResetPopupOpen(false)}
            sx={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#f44336' }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );

  return (
    <Paper sx={{ p: 4, pb: 5, mx: 2 }}>
      <Box display="flex" gap={2} sx={{ flexDirection: "column" }}>
        <Typography variant="h4">Report</Typography>
        {/* Export Button */}
        <Button
          variant="contained"
          onClick={handleExport}
          sx={{ width: "20%", alignSelf: "end" }}
        >
          Export to CSV
        </Button>
        {/* User Table */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="user table">
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Anxiety Count</TableCell>
                <TableCell>Depression Count</TableCell>
                <TableCell>Bipolar Count</TableCell>
                <TableCell>Suicide Count</TableCell>
                <TableCell>Other Count</TableCell>
                <TableCell sx={{ width: '200px' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.user_id}>
                  <TableCell>{user.user_id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.anxiety_count}</TableCell>
                  <TableCell>{user.depression_count}</TableCell>
                  <TableCell>{user.bipolar_count}</TableCell>
                  <TableCell>{user.suicide_count}</TableCell>
                  <TableCell>{user.other_count}</TableCell>
                  <TableCell sx={{ width: '200px' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mb: 1, width: '100%' }}
                      onClick={() => confirmReset(user.user_id)}
                    >
                      Reset Password
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ width: '100%' }}
                      onClick={() => confirmDelete(user.user_id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {DeleteModal}
      {ResetModal}
    </Paper>
  );

};

const styles = {
  container: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '80%',
    margin: '0 auto',
  },
  modalBox: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#f1f1f1',
    border: '2px solid #000',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    p: 4,
  }
};

export default AdminPage;
