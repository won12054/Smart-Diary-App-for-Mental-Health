import React from 'react';
import { Box, Button, List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import '../styles/DiarySidebar.css'; // For custom styles

const DiarySidebar = ({ 
  currentIndex, 
  setCurrentIndex, 
  diaryEntries, 
  addDiaryEntry,
  getFormattedTimestamp
}) => {
  
  const handleItemClick = (index) => {
    setCurrentIndex(index);
  };

  const handleAddClick = () => {
    addDiaryEntry();
    setCurrentIndex(0);
  };

  return (
    <Box 
      className="diary-sidebar" 
      sx={{
        padding: 2,
        width: 250, // Adjusted width
        backgroundColor: '#f9f9f9',
        borderRadius: 2,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh', // Full height to fit the viewport
        position: 'relative', // Ensures it's part of the main layout, not fixed
      }}
    >
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddClick}
        sx={{
          marginBottom: 2,
          width: '100%',
          textTransform: 'none',
          backgroundColor: '#4CAF50',
          ':hover': {
            backgroundColor: '#388E3C',
          }
        }}
      >
        Add New Entry
      </Button>
      <Divider sx={{ marginBottom: 2 }} />

      <List className="diary-items" sx={{ overflowY: 'auto', flexGrow: 1 }}>
        {diaryEntries.map(({ _id, created }, index) => (
          <ListItem key={_id} disablePadding>
            <ListItemButton
              onClick={() => handleItemClick(index)}
              selected={currentIndex === index}
              sx={{
                borderRadius: 1,
                marginBottom: 1,
                backgroundColor: currentIndex === index ? '#e0f7fa' : 'transparent',
                ':hover': {
                  backgroundColor: '#f1f1f1',
                }
              }}
            >
              <ListItemText primary={getFormattedTimestamp(created)} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default DiarySidebar;
