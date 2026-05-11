const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
    {
        resumeText: {
            type: String,
            required: true,
        },

        analysis: {
            type: Object,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Analysis",
    analysisSchema
);