import axios from "axios";

const API = process.env.REACT_APP_API || "http://localhost:5000";

//Login
export const postLogin = async (username, password) => {
  const user = {
    username: username,
    password: password,
  };
  return await axios.post(`${API}/v1/auth/signIn`, user);
};
//RefreshToken v1

export const token = async (username, refreshToken) => {
  const user = {
    username: username,
    refreshToken: refreshToken,
  };
  return await axios.post(`${API}/v1/auth/token`, user);
};

//Desconecta usuario
export const disconnectDevice = async (id) => {
  return await axios.put(`${API}/v1/disconnect`, id);
};
