import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, InputBase, Avatar, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const TopBar = () => {
  return (
    <AppBar position="fixed" color="primary" sx={{ zIndex: 1201 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Search Bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, maxWidth: '400px' }}>
          <SearchIcon sx={{ color: 'inherit', mr: 1 }} />
          <InputBase
            placeholder="Search..."
            sx={{
              color: 'inherit',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              padding: '6px 12px',
              borderRadius: '4px',
              flexGrow: 1,
            }}
            inputProps={{ 'aria-label': 'search' }}
          />
        </Box>

        {/* User Avatar */}
        <IconButton sx={{ ml: 2 }}>
          <Avatar src="/user-avatar.png" alt="user" />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
