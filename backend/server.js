require("dotenv").config();

// ─── Validate critical env vars before doing anything ─────────────────────────
const REQUIRED_ENV = ["MONGO_URI"];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length) {
    console.error(`❌ Missing required env vars: ${missing.join(", ")}`);
    process.exit(1);
}

// Warn if no AI provider key is set at all
const AI_KEYS = ["OPENROUTER_API_KEY", "GEMINI_API_KEY", "GROQ_API_KEY"];
if (!AI_KEYS.some((k) => process.env[k])) {
    console.warn("⚠️  No AI provider API key found. Set at least one of: " + AI_KEYS.join(", "));
}

const express = require("express");
const cors    = require("cors");

const connectDB        = require("./src/config/db");
const resumeRoutes     = require("./src/routes/resume.routes");
const errorMiddleware  = require("./src/middleware/error.middleware");

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Database ─────────────────────────────────────────────────────────────────
connectDB();

// ─── CORS — supports local dev + production frontend URL ──────────────────────
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.FRONTEND_URL, // set this in production (e.g. https://hirelens.vercel.app)
].filter(Boolean);

const corsOptions = {
    origin: (origin, cb) => {
        // allow requests with no origin (curl, Postman, server-to-server)
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

// Handle preflight OPTIONS requests for all routes
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "HireLens AI Resume Analyzer API Running",
        version: "1.0.0",
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", require("./src/routes/auth.routes"));
app.use("/api/resume", resumeRoutes);

// ─── 404 handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.path} not found` });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use(errorMiddleware);

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`✅ HireLens server running on http://localhost:${PORT}`);
});