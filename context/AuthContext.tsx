"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  username: string;
  image?: string | null;
  confirmed: boolean;
}

interface AuthContextType {
  user: User | null;
  status: "authenticated" | "unauthenticated" | "loading";
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string, confirmPassword: string, image?: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<"authenticated" | "unauthenticated" | "loading">("loading");

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setStatus("unauthenticated");
        return;
      }

      const response = await fetch("/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = localStorage.getItem("user_data");
        if (userData) {
          setUser(JSON.parse(userData));
          setStatus("authenticated");
        } else {
          setStatus("unauthenticated");
        }
      } else {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");
        setStatus("unauthenticated");
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setStatus("unauthenticated");
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    // Store token and user data
    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("user_data", JSON.stringify(data.user));
    
    setUser(data.user);
    setStatus("authenticated");
  };

  const register = async (
    email: string,
    username: string,
    password: string,
    confirmPassword: string,
    image?: string
  ) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        username,
        password,
        confirmPassword,
        image,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Registration failed");
    }

    // Store token and user data
    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("user_data", JSON.stringify(data.user));
    
    setUser(data.user);
    setStatus("authenticated");
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    setUser(null);
    setStatus("unauthenticated");
  };

  const value: AuthContextType = {
    user,
    status,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
