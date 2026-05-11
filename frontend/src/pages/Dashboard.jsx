import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchAnalyses = async () => {
      try {
        const res = await api.get("/resume/my-analyses");
        setAnalyses(res.data.data);
      } catch (err) {
        setError("Failed to fetch past analyses");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, [user, navigate]);

  const scoreColor = (s) => s >= 75 ? "text-emerald-400" : s >= 50 ? "text-amber-400" : "text-rose-400";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Dashboard</h1>
            <p className="text-slate-400">Welcome back, {user?.name}. Here are your past resume analyses.</p>
          </div>
          <Link to="/" className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl font-medium transition-colors">
            New Analysis
          </Link>
        </header>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl mb-8">
            {error}
          </div>
        )}

        {analyses.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-white mb-2">No analyses yet</h3>
            <p className="text-slate-400 mb-6">Upload your first resume to get started.</p>
            <Link to="/" className="text-violet-400 hover:text-violet-300 font-medium">Go to Analyzer →</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyses.map((item) => (
              <div key={item._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-violet-500/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-sm text-slate-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                  <div className={`font-bold text-xl ${scoreColor(item.analysis?.overallScore)}`}>
                    {item.analysis?.overallScore}/100
                  </div>
                </div>
                
                <h3 className="text-white font-semibold mb-2 line-clamp-1">
                  {item.analysis?.summary}
                </h3>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.analysis?.recommendedRoles?.slice(0, 2).map((role, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-violet-500/10 text-violet-400 rounded-md border border-violet-500/20">
                      {role}
                    </span>
                  ))}
                </div>
                
                {/* Note: In a full app, you'd add a link here to view the detailed past result */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
