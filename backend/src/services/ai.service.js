const axios = require("axios");

const analyzeWithAI = async (resumeText) => {
    const prompt = `
You are an ATS resume analyzer.

Analyze the resume and return response in valid JSON format.

Format:
{
  "overallScore": number,
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "suggestions": [],
  "recommendedRoles": []
}

Resume:
${resumeText}
`;

    const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
            model: "deepseek/deepseek-chat-v3-0324",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
        }
    );

    const result =
        response.data.choices[0].message.content;

    return JSON.parse(result);
};

module.exports = analyzeWithAI;