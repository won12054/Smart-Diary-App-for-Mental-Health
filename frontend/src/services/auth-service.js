import http from "./http-common";

class AuthService {
  login(username, password) {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);
    console.log(formData);
    return http.post(
      "/token",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      }
    )
  }

  getUserInfo(access_token) {
    return http.get(
      "/users/me",
      {
        headers: {
          Authorization: "Bearer " + access_token
        }
      }
    )
  }
}

export default new AuthService();
