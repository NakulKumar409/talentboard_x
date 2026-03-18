import axios from "axios";

// ✅ AUTO DETECT BASE URL
const getBaseURL = () => {
  const hostname = window.location.hostname;

  // 👉 LOCAL DEVELOPMENT
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:3004";
  }

  // 👉 PRODUCTION (Render / Vercel / Live)
  return "https://talentboard-x-api-with-mongo-db.onrender.com";
};

const api = axios.create({
  baseURL: getBaseURL(),
});

// ✅ TOKEN AUTO ATTACH
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
