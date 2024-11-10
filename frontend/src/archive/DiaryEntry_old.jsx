import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DiaryContent from "./DiaryContent";
import "../styles/DiaryEntry.css";
import diaryEntryService from "../services/diary-entry-service";

const DiaryEntry = () => {
  const [diaryContent, setDiaryContent] = useState("");
  const [diaryEntries, setDiaryEntries] = useState([]);

  let navigate = useNavigate();

  useEffect(() => {
    getDiaryEntries();
  }, []);

  function AddDiaryEntry() {
    diaryEntryService
      .add(diaryContent)
      .then((response) => {
        getDiaryEntries();
        setDiaryContent("")
        navigate("/diary");
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function getDiaryEntries() {
    diaryEntryService
      .readAll()
      .then((response) => {
        setDiaryEntries(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function getDiaryEntry(id) {
    diaryEntryService
      .readOne(id)
      .then((response) => {
        setDiaryContent(response.data.content);
        console.log(response.data.content);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function deleteDiaryEntry(id) {
    diaryEntryService
      .delete(id)
      .then((response) => {
        getDiaryEntries();
        navigate("/diary");
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return (
    <div className="diary-content">
      <h1>Diary Entry</h1>
      <textarea
        id="diaryEntry"
        placeholder="Record your diary entries here!"
        className='diary-area' 
        rows={10} 
        cols={50}
        value={diaryContent}
        onChange={(e) => {
          setDiaryContent(e.target.value)
        }}
      ></textarea>
      <div className='diary-buttons'>
      <button className='diary-button' type="button" id="btnSave" onClick={() => AddDiaryEntry()}>
        Save
      </button>
      <button className='diary-button' type="button" id="btnClear" onClick={() => setDiaryContent("")}>
        Clear
      </button>
      </div>
      <ul>
      {diaryEntries &&
        diaryEntries.map(({ _id, content, entry_date }) => {
          return (
            <li key={_id}>
              <DiaryContent
                key={_id}
                id={_id}
                content={content}
                entry_date={entry_date}
                deleteDiaryEntry={deleteDiaryEntry}
                getDiaryEntries={() => getDiaryEntries()}
              />
            </li>
          );
        })}
      </ul>
    </div>
    
  );
};

export default DiaryEntry;
