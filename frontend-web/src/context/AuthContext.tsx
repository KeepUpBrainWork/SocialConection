import { createContext, useEffect, useState, ReactNode } from "react";
import { UserProfile } from "../types/auth";
import api from "../api/client";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (userData: UserProfile) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const login = (userData: UserProfile) => {
    setUser(userData);
  };
  const logout = () => {
    setUser(null);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
