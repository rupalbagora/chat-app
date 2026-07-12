import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (token) {
        try {
          const me = await authService.getMe();
          setUser(me);
          localStorage.setItem("user", JSON.stringify(me));
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    init();
  }, [token]);

  const login = async (credentials) => {
    const { user: loggedInUser, token: newToken } =
      await authService.login(credentials);
    setUser(loggedInUser);
    setToken(newToken);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    localStorage.setItem("token", newToken);
    return loggedInUser;
  };

  const register = async (data) => {
    const { user: newUser, token: newToken } = await authService.register(data);
    setUser(newUser);
    setToken(newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("token", newToken);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, updateUser, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
