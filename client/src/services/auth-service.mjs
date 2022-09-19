import axios from "axios";

const url = "http://localhost:3001/api/auth/";

const login = async (username, sub) => {
  // Handle google log in
  if (sub) {
    return axios
      .post(
        url,
        {
          username,
          sub,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((res) => {
        localStorage.setItem("accessToken", res.data.accessToken);
        return res.data;
      });
  } else {
    // Handle other log in
    return axios
      .post(
        url,
        {
          username,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((res) => {
        localStorage.setItem("accessToken", res.data.accessToken);
        return res.data;
      });
  }
};

const logout = async () => {
  return axios
    .post(
      url + "logout",
      {},
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    )
    .then((res) => {
      localStorage.removeItem("accessToken");
    });
};

export { login, logout };
