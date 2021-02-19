export const setToken = (key, token) => {
  return sessionStorage.setItem(key, token);
};
export const getToken = () => {
  return sessionStorage.getItem("token");
};
export const getRefreshToken = () => {
  return sessionStorage.getItem("refreshToken");
};
export const getUsername = () => {
  return sessionStorage.getItem("username");
};
export const deleteToken = (token) => {
  return sessionStorage.removeItem(token);
};
