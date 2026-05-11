import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                    const res = await api.get("/auth/me");
                    setUser(res.data.user);
                } catch (error) {
                    localStorage.removeItem("token");
                    delete api.defaults.headers.common["Authorization"];
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        const res = await api.post("/auth/login", { email, password });
        localStorage.setItem("token", res.data.token);
        api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
    };

    const register = async (name, email, password) => {
        const res = await api.post("/auth/register", { name, email, password });
        localStorage.setItem("token", res.data.token);
        api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
    };

    const logout = () => {
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
