"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface Profile {
  id: string;
  name: string;
  role: string | null;
  username: string;
}

interface AuthContextValue {
  profile: Profile | null;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  profile: null,
  refresh: async () => {},
});

export function AuthProvider({
  children,
  initialProfile,
}: {
  children: React.ReactNode;
  initialProfile: Profile | null;
}) {
  const [profile, setProfile] = useState<Profile | null>(initialProfile);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setProfile(data);
    } catch {
      setProfile(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ profile, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
