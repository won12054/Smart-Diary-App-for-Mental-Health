import http from "./http-common";

class AuthService {
  login(username, password) {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);
    return http.post(
      "/token",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
  }

  signUpUser(name, username, email, password) {
    return http.post(
      "/user",
      {
        "full_name": name,
        "username": username,
        "email": email,
        "password": password,
        "role": "user"
      }
    )
  }

  updateUserInfo(profile) {
    const requestBody = {
        "username": profile["username"],
        "email": profile["email"],
        "full_name": profile["name"],
        "disabled": null,
        "password": profile["newPassword"],
    }

    if (!requestBody.password) {
      delete requestBody.password;
    }

    return http.put(
      "/user/",
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },
      }
    )
  }

  getUserInfo() {
    return http.get(
      "/users/me",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },
      }
    )
  }
}

export default new AuthService();
