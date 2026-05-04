import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export type Role = "admin" | "teacher" | "student";

export interface Profile {
  id: string;
  name: string;
  phone: string | null;
  role: Role;
  referral_code: string;
  referred_by: string | null;
}

type RegisterResult =
  | { ok: true; needsEmailConfirmation: boolean }
  | { ok: false; message: string };

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<Profile>;
  logout: () => Promise<void>;
  register: (
    name: string,
    email: string,
    phone: string,
    password: string,
    referralCode?: string
  ) => Promise<RegisterResult>;
}

const AuthCtx = createContext<AuthState | null>(null);

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  let timeoutId: number | undefined;
  const timeout = new Promise<T>((_resolve, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error(message)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => {
    if (timeoutId !== undefined) window.clearTimeout(timeoutId);
  });
}

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, phone, role, referral_code, referred_by")
    .eq("id", userId)
    .single();
  if (error || !data) return null;
  return data as Profile;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const p = await fetchProfile(session.user.id);
        setProfile(p);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          const p = await fetchProfile(session.user.id);
          setProfile(p);
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      const { data, error } = await withTimeout(
        supabase.auth.signInWithPassword({ email, password }),
        15000,
        "Login timed out. Please check your internet connection and try again."
      );

      if (error) throw error;
      if (!data.user) throw new Error("Login failed: missing user session.");

      // Profile should be auto-created by DB trigger; if it's not there yet, create a minimal one.
      const { data: p1, error: p1Error } = await supabase
        .from("profiles")
        .select("id, name, phone, role, referral_code, referred_by")
        .eq("id", data.user.id)
        .maybeSingle();

      if (p1Error) throw p1Error;

      if (!p1) {
        const meta = (data.user.user_metadata ?? {}) as Record<string, unknown>;
        const name = typeof meta.name === "string" && meta.name.trim() ? meta.name.trim() : (data.user.email ?? "User");
        const phone = typeof meta.phone === "string" && meta.phone.trim() ? meta.phone.trim() : null;

        const { error: insertError } = await supabase.from("profiles").insert({
          id: data.user.id,
          name,
          phone,
          role: "student",
          referred_by: null,
        });

        if (insertError) throw insertError;
      }

      const refreshed = await fetchProfile(data.user.id);
      if (!refreshed) throw new Error("Login succeeded but profile could not be loaded.");

      setUser(data.user);
      setProfile(refreshed);

      return refreshed;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
    password: string,
    referralCode?: string
  ): Promise<RegisterResult> => {
    try {
      setLoading(true);

      const emailRedirectTo =
        typeof window !== "undefined" ? `${window.location.origin}/login` : undefined;

      const { data, error } = await withTimeout(
        supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo,
            data: {
              name,
              phone,
              referral_code: referralCode ?? "",
            },
          },
        }),
        20000,
        "Registration timed out. Please check your internet connection and try again."
      );

      if (error) return { ok: false, message: error.message };

      // If email confirmations are enabled, Supabase returns no session.
      const needsEmailConfirmation = !data.session;
      return { ok: true, needsEmailConfirmation };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCtx.Provider value={{ user, profile, loading, login, logout, register }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
