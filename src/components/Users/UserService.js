import axios from "axios";

const API = process.env.REACT_APP_API || "http://localhost:5000";

export const actiUser = async (id) => {
  return await axios.delete(`${API}/v1/activate/user/${id}`);
};

export const desaUser = async (id) => {
  return await axios.delete(`${API}/v1/desactivate/user/${id}`);
};

//Obtiene Usuario
export const getUser = async (id) => {
  return await axios.get(`${API}/v1/user/${id}`);
};

//Lista Usuarios
export const getUsers = async () => {
  return await axios.get(`${API}/v1/users`);
};

//Registra Usuario
export const newUser = async (user) => {
  return await axios.post(`${API}/v1/auth/signUp`, user);
};

//Actualiza Usuario
export const updateUser = async (id, user) => {
  return await axios.put(`${API}/v1/user/${id}`, user);
};

//Obtener datos
export const getData = async () => {
  return await axios.get(`${API}/v1/auth/user`);
};
