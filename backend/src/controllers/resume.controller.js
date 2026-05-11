const fs = require("fs");

const Analysis = require("../models/analysis.model");

const extractText = require("../services/parser.service");

const { analyzeWithAI, rewriteWithAI } = require("../services/ai.service");

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
            user: req.user ? req.user._id : undefined,
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

const getMyAnalyses = async (req, res, next) => {
    try {
        const analyses = await Analysis.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: analyses,
        });
    } catch (error) {
        next(error);
    }
};

const rewriteResumeSection = async (req, res, next) => {
    try {
        const { text, instruction } = req.body;

        if (!text) {
            return res.status(400).json({
                success: false,
                message: "Text to rewrite is required",
            });
        }

        const aiResult = await rewriteWithAI(text, instruction);

        res.status(200).json({
            success: true,
            data: aiResult,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    analyzeResume,
    getMyAnalyses,
    rewriteResumeSection,
};