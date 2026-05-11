import { useState } from "react";

import api from "../services/api";

function Home() {
    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(false);

    const [result, setResult] = useState(null);

    const handleUpload = async () => {
        if (!file) return;

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append("resume", file);

            const response = await api.post(
                "/resume/analyze",
                formData
            );

            setResult(response.data.data.analysis);

        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6">

            <div className="max-w-4xl mx-auto">

                <h1 className="text-5xl font-bold text-center mb-3">
                    AI Resume Analyzer
                </h1>

                <p className="text-zinc-400 text-center mb-10">
                    Upload your resume and get AI-powered ATS analysis
                </p>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">

                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) =>
                            setFile(e.target.files[0])
                        }
                        className="mb-5 block w-full"
                    />

                    <button
                        onClick={handleUpload}
                        disabled={loading}
                        className="bg-white text-black px-6 py-3 rounded-xl font-semibold"
                    >
                        {loading ? "Analyzing..." : "Analyze Resume"}
                    </button>

                </div>

                {result && (
                    <div className="mt-10 space-y-6">

                        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                            <h2 className="text-2xl font-bold mb-2">
                                Overall Score
                            </h2>

                            <p className="text-5xl font-bold">
                                {result.overallScore}/100
                            </p>
                        </div>

                        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                            <h2 className="text-2xl font-bold mb-4">
                                Summary
                            </h2>

                            <p className="text-zinc-300">
                                {result.summary}
                            </p>
                        </div>

                        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                            <h2 className="text-2xl font-bold mb-4">
                                Suggestions
                            </h2>

                            <ul className="space-y-2">
                                {result.suggestions.map(
                                    (item, index) => (
                                        <li key={index}>
                                            • {item}
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>

                    </div>
                )}

            </div>

        </div>
    );
}

export default Home;