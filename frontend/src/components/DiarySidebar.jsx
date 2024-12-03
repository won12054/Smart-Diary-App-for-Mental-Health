import React from 'react';
import { Paper, Box, Button, List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

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
    <Paper sx={{ p: 3 }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddClick}
        sx={styles.addButton}
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
              <ListItemText primary={getFormattedTimestamp(created)} sx={{textAlign: "center"}} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

const styles = {
  addButton: {
    marginBottom: 2,
    width: '100%',
    textTransform: 'none',
    backgroundColor: '#4CAF50',
    ':hover': {
      backgroundColor: '#388E3C',
    }
  },
}

export default DiarySidebar;
