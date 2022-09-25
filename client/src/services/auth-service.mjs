import axios from "axios";

const url = "http://localhost:3001/api/auth/";

const createStudent = async (name, code) => {
      return axios
      .post(
        "http://localhost:3001/api/user/createStudent",
        {
          name: name,
          permissions: [code]
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      ).then((res) =>{
        return res.data;
      });
}

const studentLogin = async (name, code) => {

    return axios
    .post(
      url + "studentLogin",
      {
        name: name,
        permissions: [code]
      },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    )
    .then((res) => {
      sessionStorage.setItem("accessToken", res.data.accessToken);
      return res.data;
    });
    
};

const adminLogin = async (name,gIdToken) => {
  return axios
  .post(
    url+'adminLogin',
    {
      name,
      gIdToken
    },
    {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    }
  )
  .then((res) => {
    sessionStorage.setItem("accessToken", res.data.accessToken);
    return res.data;
  });
}

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
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("code");
    });
};

const refreshToken = async () => {
  return axios
  .get(
    url + "refresh",
    {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    }
  )
  .then((res) => {
    sessionStorage.setItem("accessToken", res.data.accessToken);
    return res.data.accessToken;
  });
}

export { createStudent, studentLogin, adminLogin, logout, refreshToken };
