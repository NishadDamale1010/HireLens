const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false, // Make optional so guest users can still upload (or change to true to enforce auth)
        },
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