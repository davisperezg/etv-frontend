import axios from "axios";

const API = process.env.REACT_APP_API || "http://localhost:5000";
const API_COUNTRYS = process.env.REACT_API_COUNTRYS || "http://localhost:3000";
const API_COUNTRYS_IMG =
  process.env.REACT_API_COUNTRYS_IMG || "http://localhost:3000";

//Obtiene Pais
export const getCountry = async (id) => {
  return await axios.get(`${API}/v1/country/${id}`);
};

//Lista Paises
export const getCountrys = async () => {
  return await axios.get(`${API}/v1/countrys`);
};

//Lista Bandera Pais
export const getIMGCountrys = async (cod) => {
  return await axios.get(`${API_COUNTRYS_IMG}/country/img/${cod}.svg`);
};
