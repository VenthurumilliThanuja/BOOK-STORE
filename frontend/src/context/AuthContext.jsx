import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(() => JSON.parse(localStorage.getItem("bookstoreUser") || "null"));

  useEffect(() => {
    const handler = () => setUserState(null);
    window.addEventListener("bookstore:unauthorized", handler);
    return () => window.removeEventListener("bookstore:unauthorized", handler);
  }, []);

  const setUser = (data) => {
    localStorage.setItem("bookstoreUser", JSON.stringify(data));
    setUserState(data);
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("bookstoreUser");
    setUserState(null);
  };

  const value = useMemo(() => ({ user, isAdmin: user?.role === "admin", login, register, logout, setUser }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

