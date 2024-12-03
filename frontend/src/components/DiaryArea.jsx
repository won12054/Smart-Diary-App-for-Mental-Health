import React, { useEffect, useState } from "react";
import { 
  Paper, 
  Box, 
  Button, 
  Typography, 
  TextareaAutosize, 
  CircularProgress, 
  LinearProgress, 
  IconButton, 
  Modal } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import Skeleton from '@mui/material/Skeleton';

const DiaryArea = ({ 
  diaryId,
  diaryTitle,
  diaryContent,
  setDiaryContent,
  diaryPredictionClass,
  diaryAdvice,
  saveDiaryEntry,
  deleteDiaryEntry,
  getFormattedTimestamp,
  isLoadingResponse
}) => {
  // Confirm clear diary
  const [isClearPopupOpen, setIsClearPopupOpen] = useState(false);

  const confirmClearDiary = () => {
    setIsClearPopupOpen(true);
  };

  const handleClearClick = () => {
    setDiaryContent("");
    setIsClearPopupOpen(false);
  };

  const handleSaveClick = () => {
    saveDiaryEntry(diaryId, diaryContent);
  };

  const ClearModal = (
    <Modal
      open={isClearPopupOpen}
      onClose={() => setIsClearPopupOpen(false)}
    >
      <Box sx={styles.modalBox}>
        <Typography variant="h6" component="h2" align="center">
          Are you sure you want to clear this entry?
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-around' }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleClearClick}
            sx={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#4CAF50' }}
          >
            Clear
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => setIsClearPopupOpen(false)}
            sx={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#f44336' }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );

  return (
    <>
      <Paper sx={{ p: 3 }}>
        {/* Diary Text Area */}
        <Box display="flex" gap={2} sx={{ flexDirection: "column" }}>
          {
            diaryTitle == "" ? (
              <Skeleton variant="rounded" height={42} />
            ) : (
              <Typography variant="h4" align="right">{diaryTitle}</Typography>
            )
          }
          <TextareaAutosize
            placeholder="Record your diary entries here!"
            minRows={15}
            value={diaryContent}
            onChange={(e) => setDiaryContent(e.target.value)}
            style={{
              fontFamily: 'inherit',
              padding: '10px',
              fontSize: '16px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              marginBottom: '20px',
            }}
          />
        </Box>
        
        
        {/* Action Buttons */}
        <Box display="flex" gap={2}>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<SaveIcon />}
            onClick={handleSaveClick}
            sx={{...styles.actionButtons, width: '75%'}}
          >
            Save
          </Button>
          <Button 
            variant="contained" 
            color="warning" 
            startIcon={<ClearIcon />}
            onClick={confirmClearDiary}
            sx={styles.actionButtons}
          >
            Clear
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            startIcon={<DeleteIcon />}
            onClick={() => deleteDiaryEntry(diaryId)}
            sx={styles.actionButtons}
          >
            Delete
          </Button>
          {ClearModal}
        </Box>
      </Paper>

      {/* Result Section (only show when loading or diaryAdvice is not empty) */}
      {
        (isLoadingResponse || diaryAdvice) && (
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>Response</Typography>
            {
              isLoadingResponse ? (
                <LinearProgress />
              ) : (
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  {diaryAdvice}
                </Typography>
              )
            }
          </Paper>
        )
      }
    </>
  );
};

const styles = {
  actionButtons: {
    padding: '10px 20px', 
    fontSize: '16px',
    textTransform: 'none',
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
}

export default DiaryArea;
