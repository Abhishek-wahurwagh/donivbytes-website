"use client";

import { useState, useEffect } from "react";
import { getMe, clearToken, getToken, CurrentUser } from "@/lib/api";

export interface AuthState {
  user: CurrentUser | null;
  loading: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  isAuthenticated: boolean;
  refresh: () => void;
  logout: () => void;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getMe()
      .then(setUser)
      .catch(() => {
        clearToken();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [tick]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isStudent: user?.role === "student",
    refresh: () => setTick((n) => n + 1),
    logout: () => {
      clearToken();
      setUser(null);
    },
  };
}
