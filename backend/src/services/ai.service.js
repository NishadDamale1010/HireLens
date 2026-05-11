const axios = require("axios");

// ─── Shared prompt ────────────────────────────────────────────────────────────
const buildPrompt = (resumeText) => `
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

// ─── Helper: strip markdown fences and parse JSON ─────────────────────────────
const safeParseJSON = (raw) => {
    const cleaned = raw
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();
    return JSON.parse(cleaned);
};

// ─── Provider 1: OpenRouter (meta-llama/llama-3.3-70b-instruct:free) ─────────
const tryOpenRouter = async (prompt) => {
    if (!process.env.OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY not set");

    const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
            model: "meta-llama/llama-3.3-70b-instruct:free",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://hirelens.app",
                "X-Title": "HireLens",
            },
            timeout: 60000,
        }
    );

    return safeParseJSON(response.data.choices[0].message.content);
};

// ─── Provider 2: Google Gemini (gemini-2.0-flash — free tier) ────────────────
const tryGemini = async (prompt) => {
    if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set");

    const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
            },
        },
        { timeout: 60000 }
    );

    const raw = response.data.candidates[0].content.parts[0].text;
    return safeParseJSON(raw);
};

// ─── Provider 3: Groq (llama-3.3-70b-versatile — free tier) ──────────────────
const tryGroq = async (prompt) => {
    if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY not set");

    const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.3,
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json",
            },
            timeout: 60000,
        }
    );

    return safeParseJSON(response.data.choices[0].message.content);
};

// ─── Main: try providers in order, stop on first success ─────────────────────
const analyzeWithAI = async (resumeText) => {
    const prompt = buildPrompt(resumeText);
    const providers = [
        { name: "OpenRouter (Llama 3.3 70B)", fn: tryOpenRouter },
        { name: "Google Gemini 2.0 Flash",    fn: tryGemini     },
        { name: "Groq (Llama 3.3 70B)",       fn: tryGroq       },
    ];

    let lastError;

    for (const { name, fn } of providers) {
        try {
            console.log(`🤖 Trying AI provider: ${name}`);
            const result = await fn(prompt);
            console.log(`✅ Success with: ${name}`);
            return result;
        } catch (err) {
            const status  = err.response?.status;
            const message = err.response?.data?.error?.message || err.message;
            console.warn(`⚠️  ${name} failed (${status || "no status"}): ${message}`);
            lastError = err;
        }
    }

    // All providers failed
    const error = new Error("All AI providers failed. Please try again later.");
    error.statusCode = 503;
    throw error;
};

module.exports = analyzeWithAI;