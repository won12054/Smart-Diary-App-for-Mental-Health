import React, { useEffect, useState } from "react";
const DiaryContent = ({
  id,
  content,
  entry_date,
  deleteDiaryEntry,
  getDiaryEntries
}) => {
  const deleteAndRefresh = (id) => {
    deleteDiaryEntry(id)
    getDiaryEntries()
  }

  return (
    <div>
      <span>{content}{entry_date}</span>
      <button
        type="button"
        onClick={() => deleteAndRefresh(id)}
      >
        Delete
      </button>
    </div>
  );
};

export default DiaryContent;
