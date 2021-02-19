import axios from "axios";

const API = process.env.REACT_APP_API || "http://localhost:5000";

export const activarSerie = async (id) => {
  return await axios.delete(`${API}/v1/activate/serie/${id}`);
};

export const desactivarSerie = async (id) => {
  return await axios.delete(`${API}/v1/desactivate/serie/${id}`);
};

export const activarSeason = async (id) => {
  return await axios.delete(`${API}/v1/activate/season/${id}`);
};

export const desactivarSeason = async (id) => {
  return await axios.delete(`${API}/v1/desactivate/season/${id}`);
};

export const activarChapter = async (id) => {
  return await axios.delete(`${API}/v1/activate/chapter/${id}`);
};

export const desactivarChapter = async (id) => {
  return await axios.delete(`${API}/v1/desactivate/chapter/${id}`);
};

//Obtiene Serie
export const getSerie = async (id) => {
  return await axios.get(`${API}/v1/serie/${id}`);
};

//Obtiene Season
export const getSeason = async (id) => {
  return await axios.get(`${API}/v1/season/${id}`);
};

//Obtiene Chapter
export const getChapter = async (id) => {
  return await axios.get(`${API}/v1/chapter/${id}`);
};

//Lista Series
export const getSeries = async () => {
  return await axios.get(`${API}/v1/series`);
};

//Lista Seasons
export const getSeasons = async (id) => {
  return await axios.get(`${API}/v1/seasons/serie/${id}`);
};

//Lista Chapters
export const getChapters = async (id) => {
  return await axios.get(`${API}/v1/chapters/season/${id}`);
};

//POSTS
export const newSerie = async (serie) => {
  return await axios.post(`${API}/v1/serie`, serie);
};

export const newSeason = async (season) => {
  return await axios.post(`${API}/v1/season`, season);
};

export const newChapter = async (chapter) => {
  return await axios.post(`${API}/v1/chapter`, chapter);
};

//uPDATES
export const updateSeason = async (season, id) => {
  return await axios.put(`${API}/v1/season/${id}`, season);
};

export const updateChapter = async (chapter, id) => {
  return await axios.put(`${API}/v1/chapter/${id}`, chapter);
};

export const updateSerie = async (id, movie) => {
  return await axios.put(`${API}/v1/serie/${id}`, movie);
};
