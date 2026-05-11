import { useState, useRef } from "react";
import api from "../services/api";

// Circular progress ring
function ScoreRing({ score }) {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle
          cx="70" cy="70" r={radius}
          strokeWidth="10"
          fill="none"
          stroke="#1e293b"
        />
        <circle
          cx="70" cy="70" r={radius}
          strokeWidth="10"
          fill="none"
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-black" style={{ color }}>{score}</span>
        <span className="text-xs text-slate-400 font-medium tracking-widest">/ 100</span>
      </div>
    </div>
  );
}

// Tag chip
function Tag({ label, color }) {
  const colors = {
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    red:   "bg-rose-500/10 text-rose-400 border-rose-500/20",
    blue:  "bg-blue-500/10 text-blue-400 border-blue-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    violet:"bg-violet-500/10 text-violet-400 border-violet-500/20",
  };
  return (
    <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full border ${colors[color] || colors.blue}`}>
      {label}
    </span>
  );
}

// Section card
function Card({ title, icon, children }) {
  return (
    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/60 transition-colors duration-300">
      <h3 className="text-base font-semibold text-slate-300 mb-4 flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  );
}

// List item
function ListItem({ text, icon, color }) {
  const colors = {
    green: "text-emerald-400",
    red:   "text-rose-400",
    amber: "text-amber-400",
    blue:  "text-blue-400",
  };
  return (
    <li className="flex items-start gap-3 py-1.5 border-b border-slate-700/40 last:border-0">
      <span className={`mt-0.5 ${colors[color] || "text-slate-400"}`}>{icon}</span>
      <span className="text-sm text-slate-300 leading-relaxed">{text}</span>
    </li>
  );
}

export default function Home() {
  const [file, setFile]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    const allowed = ["application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(f.type)) {
      setError("Only PDF and DOCX files are accepted.");
      return;
    }
    setFile(f);
    setError(null);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append("resume", file);
      const response = await api.post("/resume/analyze", formData);
      setResult(response.data.data.analysis);
    } catch (err) {
      setError(err.response?.data?.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const scoreLabel = (s) => s >= 75 ? "Excellent" : s >= 50 ? "Good" : "Needs Work";
  const scoreColor = (s) => s >= 75 ? "text-emerald-400" : s >= 50 ? "text-amber-400" : "text-rose-400";

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Gradient background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12">

        {/* Header */}
        <header className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            ✦ AI-Powered Analysis
          </div>
          <h1 className="text-5xl sm:text-6xl font-black bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent leading-tight mb-4">
            Hire<span className="text-violet-400">Lens</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            Upload your resume and get an instant AI-powered ATS score, strengths, gaps, and career recommendations.
          </p>
        </header>

        {/* Upload Card */}
        {!result && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 mb-8">

            {/* Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
                dragOver
                  ? "border-violet-500 bg-violet-500/10"
                  : file
                  ? "border-emerald-500/50 bg-emerald-500/5"
                  : "border-slate-600 hover:border-slate-500 hover:bg-slate-700/30"
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleFile(e.dataTransfer.files[0]);
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
              />

              {file ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl">
                    📄
                  </div>
                  <p className="text-emerald-400 font-semibold text-lg">{file.name}</p>
                  <p className="text-slate-500 text-sm">
                    {(file.size / 1024).toFixed(1)} KB · Click to change file
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-700/60 border border-slate-600/50 flex items-center justify-center text-2xl">
                    📂
                  </div>
                  <p className="text-slate-300 font-semibold text-lg">
                    Drop your resume here
                  </p>
                  <p className="text-slate-500 text-sm">or click to browse · PDF or DOCX · Max 5MB</p>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                ⚠️ {error}
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className={`mt-6 w-full py-4 rounded-xl font-bold text-base tracking-wide transition-all duration-300 ${
                loading || !file
                  ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-900/40 hover:shadow-violet-800/50 hover:-translate-y-0.5 active:translate-y-0"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Analyzing your resume…
                </span>
              ) : (
                "✦ Analyze Resume"
              )}
            </button>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-fade-in">

            {/* Top bar */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Analysis Results</h2>
              <button
                onClick={reset}
                className="text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-4 py-2 rounded-xl transition-all duration-200"
              >
                ← Analyze Another
              </button>
            </div>

            {/* Score + Summary */}
            <div className="grid sm:grid-cols-2 gap-5">
              {/* Score */}
              <Card title="ATS Score" icon="🎯">
                <div className="flex flex-col items-center gap-3 py-2">
                  <ScoreRing score={result.overallScore} />
                  <span className={`text-lg font-bold ${scoreColor(result.overallScore)}`}>
                    {scoreLabel(result.overallScore)}
                  </span>
                </div>
              </Card>

              {/* Summary */}
              <Card title="Summary" icon="📋">
                <p className="text-sm text-slate-300 leading-relaxed">{result.summary}</p>
              </Card>
            </div>

            {/* Strengths + Weaknesses */}
            <div className="grid sm:grid-cols-2 gap-5">
              <Card title="Strengths" icon="💪">
                <ul className="space-y-0">
                  {result.strengths?.map((s, i) => (
                    <ListItem key={i} text={s} icon="✓" color="green" />
                  ))}
                </ul>
              </Card>
              <Card title="Weaknesses" icon="⚡">
                <ul className="space-y-0">
                  {result.weaknesses?.map((w, i) => (
                    <ListItem key={i} text={w} icon="✗" color="red" />
                  ))}
                </ul>
              </Card>
            </div>

            {/* Suggestions */}
            <Card title="Actionable Suggestions" icon="💡">
              <ul className="space-y-0">
                {result.suggestions?.map((s, i) => (
                  <ListItem key={i} text={s} icon="→" color="amber" />
                ))}
              </ul>
            </Card>

            {/* Missing Skills */}
            {result.missingSkills?.length > 0 && (
              <Card title="Missing Skills" icon="🔍">
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills.map((skill, i) => (
                    <Tag key={i} label={skill} color="red" />
                  ))}
                </div>
              </Card>
            )}

            {/* Recommended Roles */}
            {result.recommendedRoles?.length > 0 && (
              <Card title="Recommended Job Roles" icon="🚀">
                <div className="flex flex-wrap gap-2">
                  {result.recommendedRoles.map((role, i) => (
                    <Tag key={i} label={role} color="violet" />
                  ))}
                </div>
              </Card>
            )}

          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-slate-600 text-sm">
          HireLens · Powered by DeepSeek AI via OpenRouter
        </footer>

      </div>
    </div>
  );
}