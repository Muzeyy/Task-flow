// client/src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://task-flow-backend-bkwm.onrender.come/api",
  headers: { "Content-Type": "application/json" }
});

// helper to set JWT token after login/register
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
