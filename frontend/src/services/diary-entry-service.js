import http from "./http-common";

class DiaryEntryService {
  add(content) {
    return http.post(
      "/diary_entry",
      {
        author: "Pak",
        content,
      },
      {
        headers: {
          //Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      }
    );
  }

  readAll() {
    return http.get("/diary_entry", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        //Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    });
  }

  readOne(id) {
    return http.get(`/diary_entry/${id}`, {
      headers: {
        //Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    });
  }

  delete(id) {
    return http.delete(`/diary_entry/${id}`, {
      headers: {
        //Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    });
  }

  // updateDiaryEntry(id, content) {
  //   return http.put(
  //     `/diary_entry/${id}`,
  //     {
  //       content,
  //     },
  //     {
  //       headers: {
  //         //Authorization: "Bearer " + localStorage.getItem("accessToken"),
  //       },
  //     }
  //   );
  // }
  updateDiaryEntry(id, content) {
    return http.put(
      `/diary_entry/${id}`,
      {
        content,
      },
      {
        headers: {
          //Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      }
    );
  }

  getStreak() {
    return http.get(
      "/diary_streak"
    );
  }

  getMaxStreak() {
    return http.get(
      "/max_diary_streak"
    );
  }

  getDates() {
    return http.get(
      "/diary_dates"
    );
  }
}

export default new DiaryEntryService();
