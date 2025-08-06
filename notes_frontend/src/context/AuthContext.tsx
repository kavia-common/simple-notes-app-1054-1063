"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  token: string;
};

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// PUBLIC_INTERFACE
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Guard localStorage access for SSR/static build
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("auth_user");
      if (data) {
        setUser(JSON.parse(data));
      }
    }
    setIsLoading(false);
  }, []);

  // PUBLIC_INTERFACE
  const login = async (email: string, password: string) => {
    try {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        console.error("NEXT_PUBLIC_API_URL is not defined. Please set it in your .env file.");
        alert("Configuration error: NEXT_PUBLIC_API_URL is missing.");
        return false;
      }
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      const authUser: AuthUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        token: data.token,
      };
      localStorage.setItem("auth_user", JSON.stringify(authUser));
      setUser(authUser);
      return true;
    } catch {
      return false;
    }
  };

  // PUBLIC_INTERFACE
  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) return false;
      await res.json();
      // auto-login on register success
      return await login(email, password);
    } catch {
      return false;
    }
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    localStorage.removeItem("auth_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }
  return context;
}
