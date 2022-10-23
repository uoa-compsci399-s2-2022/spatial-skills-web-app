import axios from "axios";

const url = process.env.NODE_ENV === 'production'? `${process.env.REACT_APP_DOMAIN}/api/`: "http://localhost:3001/api/";

const createStudent = async (name, code) => {
      return axios
      .post(
        url + "user/createStudent",
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
      url + "auth/studentLogin",
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
      sessionStorage.removeItem("adminRights")
      return res.data;
    });
    
};

const adminLogin = async (name,gIdToken) => {
  return axios
  .post(
    url+'auth/adminLogin',
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
    sessionStorage.setItem("adminRights", true);
    return res.data;
  });
}

const logout = async () => {
  return axios
    .post(
      url + "auth/logout",
      {},
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    )
    .then((res) => {
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("code");
      sessionStorage.removeItem("adminRights")
    });
};

const refreshToken = async () => {
  return axios
  .get(
    url + "auth/refresh",
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
