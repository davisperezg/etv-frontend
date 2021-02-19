import axios from "axios";

const API = process.env.REACT_APP_API || "http://localhost:5000";

//Lista Generos
export const getGenres = async () => {
  return await axios.get(`${API}/v1/genres`);
};

//Lista Genero por Id para edit
export const getGenre = async (id) => {
  return await axios.get(`${API}/v1/genre${id}`);
};
