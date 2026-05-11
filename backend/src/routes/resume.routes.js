const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload.middleware");

const { protect, optionalAuth } = require("../middleware/auth.middleware");

const {
    analyzeResume,
    getMyAnalyses,
    rewriteResumeSection,
} = require("../controllers/resume.controller");

// Analysis route - optionally attach user if logged in
router.post(
    "/analyze",
    optionalAuth,
    upload.single("resume"),
    analyzeResume
);

// Get past analyses - requires auth
router.get("/my-analyses", protect, getMyAnalyses);

// Rewrite resume section - optionally requires auth
router.post("/rewrite", optionalAuth, rewriteResumeSection);

module.exports = router;