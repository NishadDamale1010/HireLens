import axios from "axios";

// Local dev  → Vite proxy strips /api and forwards to http://localhost:5000
// Production → VITE_API_URL must be set to your backend URL (e.g. https://hirelens-backend.onrender.com)
const baseURL = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : "/api";

const api = axios.create({
    baseURL,
    timeout: 120000, // 2 min — AI analysis can take a while on free tier
    headers: { "Content-Type": "application/json" },
});

// Global response interceptor — normalise error messages
api.interceptors.response.use(
    (res) => res,
    (err) => {
        const message =
            err.response?.data?.message ||
            (err.code === "ECONNABORTED" ? "Request timed out. Please try again." : null) ||
            err.message ||
            "Something went wrong.";
        err.displayMessage = message;
        return Promise.reject(err);
    }
);

export default api;