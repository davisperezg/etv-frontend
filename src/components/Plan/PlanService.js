import axios from "axios";

const API = process.env.REACT_APP_API || "http://localhost:5000";

export const getPlans = async () => {
  return await axios.get(`${API}/v1/plans`);
};
