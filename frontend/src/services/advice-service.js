import http from "./http-common";

class AdviceService {
  generateAdvice(id) {
    return http.post(
      "/generate-advice-rag",
      {
        "text": id
      },
      {
        headers: {
          //Authorization: "Bearer " + localStorage.getItem("accessToken"),
        }
      }
    );
  }
}

export default new AdviceService();