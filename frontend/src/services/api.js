import axios from "axios";

const api = axios.create({
  baseURL: "/api",  // proxied to http://localhost:5000/api via Vite
});

export default api;