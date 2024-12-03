import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';
import logo from '../images/wellmind-logo-clean.png';

import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import EditNoteIcon from '@mui/icons-material/EditNote';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const Header = ({ username, isLoggedIn, onLogout, userRole }) => {
  const DEFAULT_TITLE = "Welcome to Well-Mind";
  const location = useLocation();

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const getTitle = () => {
    if (isLoggedIn) {
      switch (location.pathname) {
        case '/':
          return 'Dashboard';
        case '/diary':
          return 'Your Diary';
        case '/profile':
          return 'Profile';
        case '/admin':
          return 'Admin Report';
        default:
          return 'Welcome to Well-Mind';
      }
    }
    return DEFAULT_TITLE;
  }

  const UserDrawerItems = (
    <>
      <ListItem>
        <ListItemButton component={Link} to="/">
          <ListItemIcon>
            <SpaceDashboardIcon sx={{ color: '#fff' }}/>
          </ListItemIcon>
          <ListItemText primary={"Dashboard"}/>
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ListItemButton component={Link} to="/diary">
          <ListItemIcon>
            <EditNoteIcon sx={{ color: '#fff' }}/>
          </ListItemIcon>
          <ListItemText primary={"Diary"}/>
        </ListItemButton>
      </ListItem>
    </>
  );

  const AdminDrawerItems = (
    <>
      <ListItem>
        <ListItemButton component={Link} to="/admin">
          <ListItemIcon>
            <AdminPanelSettingsIcon sx={{ color: '#fff' }}/>
          </ListItemIcon>
          <ListItemText primary="Admin Report" />
        </ListItemButton>
      </ListItem>
    </>
  );

  const DrawerList = (
    <Box sx={{ 
      width: 230,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center', 
      pt: 2,
      }} 
      role="presentation" onClick={toggleDrawer(false)}>
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
      <List>
        { userRole !== "admin" ? (
            <>
              {UserDrawerItems}
            </>
          ) : (
            <>
              {AdminDrawerItems}
            </>
        )}
        
        <ListItem>
          <ListItemButton component={Link} to="/profile">
            <ListItemIcon>
              <AccountCircleIcon sx={{ color: '#fff' }}/>
            </ListItemIcon>
            <ListItemText primary={"My Profile"}/>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={onLogout}>
            <ListItemIcon>
              <LogoutIcon sx={{ color: '#fff' }}/>
            </ListItemIcon>
            <ListItemText primary={"Logout"}/>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar position="static">
      <Toolbar sx={{ position: "relative", display: "flex", justifyContent: "space-between" }}>
        {/* Left-Aligned Icon Button */}
        {isLoggedIn && (
          <>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer open={open} onClose={toggleDrawer(false)} sx={styles.drawer}>
              {DrawerList}
            </Drawer>
          </>
        )}
        
        {/* Centered Title with Absolute Positioning */}
        <Typography variant="h5" sx={styles.centeredTitle}>
          {getTitle()}
        </Typography>
        
        {/* Right-Aligned Greeting */}
        {username && (
          <Typography variant="h5" align="right">
            Hello, {username}
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
  
};

const styles = {
  drawer: {
    '& .MuiDrawer-paper': {
      boxSizing: 'border-box',
      backgroundColor: '#008080', // Muted navy for drawer background
      color: '#fff',              // White text for contrast
    },
  },
  centeredTitle: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
  }
}

export default Header;