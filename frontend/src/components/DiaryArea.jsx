import React, { useEffect, useState } from "react";
import Popup from 'reactjs-popup';
import { Box, Button, Typography, TextareaAutosize, CircularProgress, IconButton } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import '../styles/DiaryArea.css';

const DiaryArea = ({ 
  diaryId,
  diaryTitle,
  diaryContent,
  setDiaryContent,
  diaryPredictionClass,
  diaryAdvice,
  saveDiaryEntry,
  deleteDiaryEntry,
  getFormattedTimestamp
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

  return (
    <>
      <Box className="diary-area" sx={{ padding: 2 }}>
        {
          diaryTitle == "" ? (
            <CircularProgress />
          ) : (
            <Typography variant="h4" className="diary-h1">{diaryTitle}</Typography>
          )
        }
        {/* Diary Text Area */}
        <TextareaAutosize
          aria-label="diary entry"
          placeholder="Record your diary entries here!"
          minRows={15}
          value={diaryContent}
          onChange={(e) => setDiaryContent(e.target.value)}
          style={{
            width: '94%',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            marginBottom: '20px'
          }}
        />
        
        {/* Action Buttons */}
        <Box display="flex" gap={2} className="diary-buttons">
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<SaveIcon />}
            onClick={handleSaveClick}
            sx={{ padding: '10px 20px', fontSize: '16px' }}
          >
            Save
          </Button>
          <Button 
            variant="outlined" 
            color="warning" 
            startIcon={<ClearIcon />}
            onClick={confirmClearDiary}
            sx={{ padding: '10px 20px', fontSize: '16px' }}
          >
            Clear
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            startIcon={<DeleteIcon />}
            onClick={() => deleteDiaryEntry(diaryId)}
            sx={{ padding: '10px 20px', fontSize: '16px' }}
          >
            Delete
          </Button>
        </Box>

        {/* Clear Confirmation Popup */}
        <Popup
          open={isClearPopupOpen}
          closeOnDocumentClick
          onClose={() => setIsClearPopupOpen(false)}
          contentStyle={{
            width: '300px',
            padding: '20px',
            backgroundColor: '#f1f1f1',
            textAlign: 'center',
            borderRadius: '10px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
          }}
          modal
        >
          <Box>
            <Typography variant="h6" sx={{ marginBottom: '20px' }}>
              Are you sure you want to clear this entry?
            </Typography>
            <Box display="flex" justifyContent="space-around">
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={handleClearClick}
              >
                OK
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<CancelIcon />}
                onClick={() => setIsClearPopupOpen(false)}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Popup>
      </Box>

      {/* Result Section */}
      <Box className="result-area" sx={{ padding: 2, marginTop: 3 }}>
        <Typography variant="h4" className="result-h1">Result</Typography>
        <Typography variant="body1">
          <b>Prediction:</b><br />{diaryPredictionClass}
        </Typography>
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          <b>Response:</b><br />{diaryAdvice}
        </Typography>
      </Box>
    </>
  );
};

export default DiaryArea;
