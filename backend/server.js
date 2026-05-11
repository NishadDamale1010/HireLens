require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./src/config/db");

const resumeRoutes = require("./src/routes/resume.routes");
const errorMiddleware = require("./src/middleware/error.middleware");

const app = express();

const PORT = process.env.PORT || 5000;

// connect mongodb
connectDB();

// middlewares
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// health check
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "HireLens AI Resume Analyzer API Running",
    });
});

// routes
app.use("/api/resume", resumeRoutes);

// global error handler
app.use(errorMiddleware);

// start server
app.listen(PORT, () => {
    console.log(`✅ HireLens server running on http://localhost:${PORT}`);
});