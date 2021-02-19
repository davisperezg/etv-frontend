import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import axios from "axios";
import {
  getToken,
  deleteToken,
  getUsername,
  setToken,
  getRefreshToken,
} from "./components/SessionStorage/Token";
import { token } from "./components/Login/LoginService";

const API = process.env.REACT_APP_API || "http://localhost:5000";

axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    // config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

//Add a response interceptor

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      originalRequest.url === `${API}/v1/auth/token`
    ) {
      //deleteToken("token");
      //deleteToken("refreshToken");
      //deleteToken("username");
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const username = getUsername();
        const refreshToken = getRefreshToken();
        const resToken = await token(username, refreshToken);
        if (resToken.status === 200) {
          setToken("token", resToken.data.token);
          const token = getToken();
          axios.defaults.headers.common["Authorization"] = "Bearer " + token;
          return axios(originalRequest);
        }
      } catch (e) {
        //console.log("test");
      }
    }
    return Promise.reject(error);
  }
);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,

  document.getElementById("root")
);
