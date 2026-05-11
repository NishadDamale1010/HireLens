const multer = require("multer");
const path = require("path");
const os = require("os");

// ─── Use OS temp dir — works on Render, Railway, Vercel, local ───────────────
// "src/uploads/" breaks on read-only deployment filesystems
const storage = multer.diskStorage({
    destination: os.tmpdir(),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "hirelens-" + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (req, file, cb) => {
        const allowed = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            const err = new Error("Only PDF and DOCX files are allowed");
            err.statusCode = 400;
            cb(err, false);
        }
    },
});

module.exports = upload;