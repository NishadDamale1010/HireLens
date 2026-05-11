const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload.middleware");

const {
    analyzeResume,
} = require("../controllers/resume.controller");

router.post(
    "/analyze",
    upload.single("resume"),
    analyzeResume
);

module.exports = router;