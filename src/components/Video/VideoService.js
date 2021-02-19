import axios from "axios";

const API = process.env.REACT_APP_API || "http://localhost:5000";

export const getURLPeli = async (url) => {
  return await axios.get(`${url}`);
};

export const actiVideo = async (id) => {
  return await axios.delete(`${API}/v1/video/activate/${id}`);
};

export const desaVideo = async (id) => {
  return await axios.delete(`${API}/v1/video/desactivate/${id}`);
};

//Obtiene Video
export const getVideo = async (id) => {
  return await axios.get(`${API}/v1/video/${id}`);
};

//Lista Video para usuarios
export const getVideos = async () => {
  return await axios.get(`${API}/v1/videos`);
};

//Lista Video para SA Y A
export const getAllVideos = async () => {
  return await axios.get(`${API}/v1/all/videos`);
};

//Registra Video
export const newVideo = async (movie) => {
  return await axios.post(`${API}/v1/video`, movie);
};

//Actualiza Movie
export const updateVideo = async (id, movie) => {
  return await axios.put(`${API}/v1/video/${id}`, movie);
};
