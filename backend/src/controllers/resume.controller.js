const fs = require("fs");

const Analysis = require("../models/analysis.model");

const extractText = require("../services/parser.service");

const analyzeWithAI = require("../services/ai.service");

const analyzeResume = async (req, res, next) => {
    let filePath = "";

    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No resume uploaded",
            });
        }

        filePath = req.file.path;

        // extract text from file
        const resumeText = await extractText(
            filePath,
            req.file.mimetype
        );

        if (!resumeText || resumeText.length < 50) {
            return res.status(400).json({
                success: false,
                message: "Resume content too short",
            });
        }

        // ai analysis
        const aiResult = await analyzeWithAI(resumeText);

        // save in db
        const analysis = await Analysis.create({
            resumeText,
            analysis: aiResult,
        });

        res.status(200).json({
            success: true,
            data: analysis,
        });

    } catch (error) {
        next(error);

    } finally {
        // delete uploaded file
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
};

module.exports = {
    analyzeResume,
};