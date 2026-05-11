const errorMiddleware = (err, req, res, next) => {
    // Multer-specific errors
    const { MulterError } = require("multer");
    if (err instanceof MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                success: false,
                message: "File too large. Maximum size is 5MB.",
            });
        }
        return res.status(400).json({ success: false, message: err.message });
    }

    const statusCode = err.statusCode || 500;
    const message    = err.message    || "Internal Server Error";

    // Log server-side errors only (don't log 4xx noise)
    if (statusCode >= 500) {
        console.error("❌ Server Error:", err);
    }

    res.status(statusCode).json({ success: false, message });
};

module.exports = errorMiddleware;