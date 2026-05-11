const axios = require("axios");

const analyzeWithAI = async (resumeText) => {
    const prompt = `
You are an expert ATS (Applicant Tracking System) resume analyzer.

Analyze the following resume carefully and return ONLY a valid JSON object — no markdown, no code fences, no extra text.

JSON format:
{
  "overallScore": <number 0-100>,
  "summary": "<brief overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "weaknesses": ["<weakness 1>", "<weakness 2>", ...],
  "missingSkills": ["<skill 1>", "<skill 2>", ...],
  "suggestions": ["<actionable suggestion 1>", "<actionable suggestion 2>", ...],
  "recommendedRoles": ["<role 1>", "<role 2>", ...]
}

Resume:
${resumeText}
`;

    const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
            model: "meta-llama/llama-3.3-70b-instruct:free",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            response_format: { type: "json_object" },
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
        }
    ).catch((err) => {
        // Surface the real OpenRouter error (e.g., 402 Payment Required, 429 Rate Limited)
        const status = err.response?.status;
        const message =
            err.response?.data?.error?.message ||
            err.response?.data?.message ||
            err.message ||
            "AI service unavailable";
        const error = new Error(`AI API Error (${status || "unknown"}): ${message}`);
        error.statusCode = status || 502;
        throw error;
    });

    let result = response.data.choices[0].message.content;

    // Strip markdown code fences if present
    result = result.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

    return JSON.parse(result);
};

module.exports = analyzeWithAI;