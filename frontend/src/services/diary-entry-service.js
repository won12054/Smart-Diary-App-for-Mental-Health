import http from "./http-common";

class DiaryEntryService {
  // Add Diary Entry
  add(content, userId) {
    return http.post(
      "/diary_entry",
      {
        author: userId,
        content,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },
      }
    );
  }

  // Get All Diary Entry
  readAll() {
    return http.get("/diary_entry", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      },
    });
  }

  // Get a single diary entry
  readOne(id) {
    return http.get(`/diary_entry/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      },
    });
  }

  // Delete a diary entry
  delete(id) {
    return http.delete(`/diary_entry/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      },
    });
  }

  // Update a diary entry
  updateDiaryEntry(id, content) {
    return http.put(
      `/diary_entry/${id}`,
      {
        content,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },
      }
    );
  }

  // Get current streak of diary entries
  getStreak() {
    return http.get(
      "/diary_streak",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },
      }
    );
  }

  // Get max streak of diary entries
  getMaxStreak() {
    return http.get(
      "/max_diary_streak",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },
      }
    );
  }

  // Get all dates that have a diary entry
  getDates() {
    return http.get(
      "/diary_dates",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },
      }
    );
  }

  // Get prediction summary (counts)
  getSummary() {
    return http.get(
      "/prediction_summary",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },
      }
    );
  }
}

export default new DiaryEntryService();
