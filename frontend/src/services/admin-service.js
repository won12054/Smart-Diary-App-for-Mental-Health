import http from "./http-common";

class AdminService {
  getUsers() {
    return http.get(
      "/admin/user",
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        }
      }
    );
  }

  resetPassword(id, newPassword) {
    return http.put(
      "/admin/reset_user_pwd/" + id,
      {
        "password": newPassword
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        }
      }
    );
  }

  deleteUser(id) {
    return http.delete(
      "/admin/delete_user/" + id,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        }
      }
    );
  }
}

export default new AdminService();