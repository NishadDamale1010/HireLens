import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
          HireLens
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link to="/" className="text-slate-300 hover:text-white transition-colors">Analyzer</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors">Dashboard</Link>
              <button 
                onClick={handleLogout}
                className="text-slate-400 hover:text-rose-400 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-300 hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
