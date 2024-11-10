import React, { useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const AdminPage = () => {
  // Mocking a list of users
  const [users, setUsers] = useState([
    { userId: 1, username: 'user1', email: 'user1@mail.com', numberOfDiaries: 5 },
    { userId: 2, username: 'user2', email: 'user2@mail.com', numberOfDiaries: 10 },
    { userId: 3, username: 'user3', email: 'user3@mail.com', numberOfDiaries: 3 },
    { userId: 4, username: 'user4', email: 'user4@mail.com', numberOfDiaries: 8 },
  ]);

  // Delete user function
  const handleDelete = (userId) => {
    setUsers(users.filter(user => user.userId !== userId)); // Filter out the user to be deleted
  };

  return (
    <div style={styles.container}>
      <h2>Admin Dashboard</h2>

      {/* User Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="user table">
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Number of Diaries</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.userId}>
                <TableCell>{user.userId}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.numberOfDiaries}</TableCell>
                <TableCell>
                  <Button variant="contained" color="error" onClick={() => handleDelete(user.userId)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
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
};

export default AdminPage;
