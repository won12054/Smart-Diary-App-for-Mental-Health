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

const DiaryPage = () => {
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
    diaryEntryService.add("").then((response) => {
      getDiaryEntries();
      setCurrentIndex(0);
      navigate("/diary");
    }).catch((e) => {
      console.log(e);
    });
  };

  const getDiaryEntries = () => {
    diaryEntryService.readAll().then((response) => {
      setDiaryEntries(response.data);
      console.log(response.data);
    }).catch((e) => {
      console.log(e);
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
      });
      setIsDeletePopupOpen(false);
      setDeleteEntryId(null);
    }
  };

  const saveDiaryEntry = (id, content) => {
    diaryEntryService.updateDiaryEntry(id, content).then((response) => {
      getDiaryEntries();
    }).catch((e) => {
      console.log(e);
    });
  };

  return (
    <div className="diary-page" style={{ display: 'flex', height: '100vh' }}>
      {/* Main Content Area */}
      <div className="diary-content" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
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
          />
        ) : (
          <p>No diary entries found. Please add a new entry.</p>
        )}

        {/* Delete Confirmation Popup */}
        <Popup
          open={isDeletePopupOpen}
          closeOnDocumentClick
          onClose={() => setIsDeletePopupOpen(false)}
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
          <div>
            <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>
              Are you sure you want to delete this entry?
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <button
                onClick={deleteDiaryEntry}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  backgroundColor: '#4CAF50',
                  color: '#ffffff',
                }}
              >
                OK
              </button>
              <button
                onClick={() => setIsDeletePopupOpen(false)}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  backgroundColor: '#f44336',
                  color: '#ffffff',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </Popup>
      </div>

      {/* Sidebar on the Right */}
      <div style={{ width: '250px', flexShrink: 0 }}>
        <DiarySidebar 
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          diaryEntries={diaryEntries}
          addDiaryEntry={addDiaryEntry}
          getFormattedTimestamp={getFormattedTimestamp}
        />
      </div>
    </div>
  );
};

export default DiaryPage;
