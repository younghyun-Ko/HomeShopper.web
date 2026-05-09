"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthResponse, AuthUser, UserRole } from "@/lib/auth-types";

type Credentials = {
  email: string;
  password: string;
  name?: string;
  user_role: UserRole;
  agencyName?: string;
  licenseNumber?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (credentials: Credentials) => Promise<AuthUser>;
  signup: (credentials: Credentials) => Promise<AuthUser>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function parseAuthResponse(response: Response) {
  const data = (await response.json()) as Partial<AuthResponse> & { message?: string };

  if (!response.ok || !data.user) {
    throw new Error(data.message || "요청을 처리하지 못했습니다.");
  }

  return data.user;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: AuthResponse | null) => {
        if (mounted) setUser(data?.user ?? null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (credentials: Credentials) => {
    const authUser = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    }).then(parseAuthResponse);

    setUser(authUser);
    return authUser;
  }, []);

  const signup = useCallback(async (credentials: Credentials) => {
    const authUser = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    }).then(parseAuthResponse);

    setUser(authUser);
    return authUser;
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, signup, logout }),
    [loading, login, logout, signup, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
