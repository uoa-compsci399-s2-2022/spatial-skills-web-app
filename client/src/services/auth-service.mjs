import axios from "axios";

const url = "http://localhost:3001/api/auth/";

const login = (username, sub) => {
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
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((res) => {
        localStorage.setItem("accessToken", res.data.accessToken);
        return res.data;
      });
  }
};

export default login ;
