"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Quick utility functions for vanilla cookie management
const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax;Secure`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const eraseCookie = (name: string) => {
  document.cookie = `${name}=; Max-Age=-99999999;path=/;`;
};

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, userData: User, rememberMeDays?: number) => void;
  signup: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Unified authentication processing lifecycle hook
  useEffect(() => {
    // 1. Intercept inbound Google OAuth validation query streams
    const oauthToken = searchParams.get("token");
    const oauthUserRaw = searchParams.get("user");
    const oauthRedirect = searchParams.get("redirect");
    const oauthError = searchParams.get("error");

    if (oauthError) {
      console.error(
        "Google Authentication error fallback:",
        decodeURIComponent(oauthError),
      );
      setLoading(false);
      return;
    }

    if (oauthToken && oauthUserRaw) {
      try {
        const decodedUserData: User = JSON.parse(
          decodeURIComponent(oauthUserRaw),
        );

        // Execute underlying persistence sequence directly
        setCookie("authToken", oauthToken, 7);
        localStorage.setItem("authUser", JSON.stringify(decodedUserData));
        setUser(decodedUserData);

        // Resolve path redirection cleanups safely
        const targetDestination = oauthRedirect
          ? decodeURIComponent(oauthRedirect)
          : "/";
        router.push(targetDestination);
        setLoading(false);
        return;
      } catch (err) {
        console.error(
          "Critical error parsing inbound user context stream:",
          err,
        );
      }
    }

    // 2. Standard Session Fallback Evaluation on mount
    const token = getCookie("authToken");
    const storedUser = localStorage.getItem("authUser");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        logout();
      }
    }
    setLoading(false);
  }, [searchParams, router]);

  const handleRedirect = () => {
    const redirectUrl = searchParams.get("redirect") || "/";
    router.push(redirectUrl);
  };

  const login = (token: string, userData: User, rememberMeDays = 7) => {
    setCookie("authToken", token, rememberMeDays);
    localStorage.setItem("authUser", JSON.stringify(userData));
    setUser(userData);
    handleRedirect();
  };

  const signup = () => {
    handleRedirect();
  };

  const logout = () => {
    eraseCookie("authToken");
    localStorage.removeItem("authUser");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
