// Import React things
import React, { useEffect, useState } from "react";
import Popup from 'reactjs-popup';
import { useNavigate } from "react-router-dom";

// Import components
import DiarySidebar from "./DiarySidebar";
import DiaryArea from "./DiaryArea";

// Import services
import diaryEntryService from "../services/diary-entry-service";

// Import styles
import 'reactjs-popup/dist/index.css';
import "../styles/DiaryPage.css";

// Import mui components
import { Box, Typography, Paper, Modal, Button } from '@mui/material';

const DiaryPage = ({ userId, onLogout }) => {
  const UNAUTHORIZED_LOGOUT_MESSAGE = "Token expired. Please log in again!";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [diaryEntry, setDiaryEntry] = useState({});
  const [diaryId, setDiaryId] = useState("");
  const [diaryContent, setDiaryContent] = useState("");
  const [diaryPredictionClass, setDiaryPredictionClass] = useState("");
  const [diaryAdvice, setDiaryAdvice] = useState("");
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deleteEntryId, setDeleteEntryId] = useState(null);
  const [diaryTitle, setDiaryTitle] = useState("");

  const [isLoadingResponse, setIsLoadingResponse] = useState(false);

  let navigate = useNavigate();

  // Load diary entries when page loads
  useEffect(() => {
    getDiaryEntries();
  }, []);

  // Update current diary entry when index or diary entries change
  useEffect(() => {
    if (diaryEntries.length > 0) {
      const currentEntry = diaryEntries[currentIndex];
      setDiaryEntry(currentEntry);
      setDiaryId(currentEntry["_id"]);
      setDiaryContent(currentEntry["content"]);
      setDiaryPredictionClass(currentEntry["prediction_class"]);
      setDiaryAdvice(currentEntry["advice"]);
      setDiaryTitle(getFormattedTimestamp(currentEntry["created"]));
    }
  }, [diaryEntries, currentIndex]);

  const getFormattedTimestamp = (timestamp) => {
    const dateObj = new Date(timestamp);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('default', { month: 'short' });
    const year = dateObj.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const addDiaryEntry = () => {
    diaryEntryService.add("", userId).then((response) => {
      getDiaryEntries();
      setCurrentIndex(0);
      navigate("/diary");
    }).catch((e) => {
      console.log(e);
      if (e.response && e.response.status === 401) {
        onLogout(UNAUTHORIZED_LOGOUT_MESSAGE);
      }
    });
  };

  const getDiaryEntries = () => {
    diaryEntryService.readAll().then((response) => {
      setDiaryEntries(response.data);
    }).catch((e) => {
      console.log(e);
      if (e.response && e.response.status === 401) {
        onLogout(UNAUTHORIZED_LOGOUT_MESSAGE);
      }
    });
  };

  // Confirm delete diary
  const confirmDeleteDiary = (id) => {
    setDeleteEntryId(id);
    setIsDeletePopupOpen(true);
  };

  // Delete diary entry
  const deleteDiaryEntry = () => {
    if (deleteEntryId) {
      diaryEntryService.delete(deleteEntryId).then((response) => {
        getDiaryEntries();
        navigate("/diary");
      }).catch((e) => {
        console.log(e);
        if (e.response && e.response.status === 401) {
          onLogout(UNAUTHORIZED_LOGOUT_MESSAGE);
        }
      });
      setIsDeletePopupOpen(false);
      setDeleteEntryId(null);
      setCurrentIndex(0);
    }
  };

  const saveDiaryEntry = (id, content) => {
    setIsLoadingResponse(true);
    diaryEntryService.updateDiaryEntry(id, content).then((response) => {
      getDiaryEntries();
      setIsLoadingResponse(false);
    }).catch((e) => {
      console.log(e);
      if (e.response && e.response.status === 401) {
        onLogout(UNAUTHORIZED_LOGOUT_MESSAGE);
      }
    });
  };

  const DeleteModal = (
    <Modal
      open={isDeletePopupOpen}
      onClose={() => setIsDeletePopupOpen(false)}
    >
      <Box sx={styles.modalBox}>
        <Typography variant="h6" component="h2" align="center">
          Are you sure you want to delete this entry?
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-around' }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={deleteDiaryEntry}
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
      {/* Content Area */}
      <Box sx={{ flex: 1, mr: 2 }}>
        {diaryEntries.length > 0 ? (
          <DiaryArea
            diaryId={diaryId}
            diaryTitle={diaryTitle}
            diaryContent={diaryContent}
            setDiaryContent={setDiaryContent}
            diaryPredictionClass={diaryPredictionClass}
            diaryAdvice={diaryAdvice}
            saveDiaryEntry={saveDiaryEntry}
            deleteDiaryEntry={confirmDeleteDiary}
            getFormattedTimestamp={getFormattedTimestamp}
            isLoadingResponse={isLoadingResponse}
          />
        ) : (
          <p>No diary entries found. Please add a new entry.</p>
        )}
        {DeleteModal}
      </Box>

      {/* Sidebar */}
      <Box sx={{ width: 250 }}>
        <DiarySidebar 
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          diaryEntries={diaryEntries}
          addDiaryEntry={addDiaryEntry}
          getFormattedTimestamp={getFormattedTimestamp}
        />
      </Box>
    </Box>
  );
};

const styles = {
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

export default DiaryPage;
