import React from 'react';
import { Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookIcon from '@mui/icons-material/Book';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout'; 
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'; // Admin Icon
import logo from '../images/wellmind-logo-clean.png';

const Sidebar = ({ onLogout, userRole }) => {
  const drawerWidth = 200;

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#333',
          color: '#fff',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2 }}>
        {/* Logo at the top */}
        <Link to="/">
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              height: '90px',
              mb: 2,
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
              },
            }}
          />
        </Link>

        {/* Navigation Links */}
        <List>
          {/* Regular User Links */}
          {userRole !== 'admin' && (
            <>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/">
                  <ListItemIcon>
                    <DashboardIcon sx={{ color: '#ffeb3b' }} />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton component={Link} to="/diary">
                  <ListItemIcon>
                    <BookIcon sx={{ color: '#ffeb3b' }} />
                  </ListItemIcon>
                  <ListItemText primary="Diary" />
                </ListItemButton>
              </ListItem>
            </>
          )}

          {/* Admin-specific Links */}
          {userRole === 'admin' && (
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/admin">
                <ListItemIcon>
                  <AdminPanelSettingsIcon sx={{ color: '#ffeb3b' }} />
                </ListItemIcon>
                <ListItemText primary="Admin Report" />
              </ListItemButton>
            </ListItem>
          )}

          
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/profile">
              <ListItemIcon>
                <AccountCircleIcon sx={{ color: '#ffeb3b' }} />
              </ListItemIcon>
              <ListItemText primary="My Profile" />
            </ListItemButton>
          </ListItem>

          {/* Logout Button */}
          <ListItem disablePadding>
            <ListItemButton onClick={onLogout}>
              <ListItemIcon>
                <LogoutIcon sx={{ color: '#ffeb3b' }} />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;