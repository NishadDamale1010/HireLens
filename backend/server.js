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
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// test route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "AI Resume Analyzer API Running",
    });
});

// routes
app.use("/api/resume", resumeRoutes);

// global error handler
app.use(errorMiddleware);

// start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});