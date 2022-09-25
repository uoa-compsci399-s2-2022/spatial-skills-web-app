import axios from "axios";
import { refreshToken } from "./auth-service.mjs";

const axiosAPICaller = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

// DESCRIPTION: Intercepts requests and adds authorization header
axiosAPICaller.interceptors.request.use(
  (config) => {
    const aT = sessionStorage.getItem("accessToken");
    if (aT) {
      config.headers["Authorization"] = `Bearer ${aT}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// DESCRIPTION: Intercepts responses. Tries to refresh access token if it is expired
axiosAPICaller.interceptors.response.use(
  (res) => {
    // Do nothing if no error
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    // Try to refersh access token if receive 401 Unauthorised. Only retry request once after refresh
    if (err.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;
      try {
        const aT = await refreshToken();
        sessionStorage.setItem("accessToken", aT);
        originalConfig.headers["Authorization"] = `Bearer  ${aT}`;
        return axiosAPICaller(originalConfig);
      } catch (e) {
        return Promise.reject(e);
      }
    }
    return Promise.reject(err);
  }
);

export default axiosAPICaller;