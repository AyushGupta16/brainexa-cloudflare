import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

/** sessionStorage key used to hand an OAuth error to the login page. */
export const OAUTH_ERROR_KEY = "brainexa.oauthError";

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
  signInWithGoogle: () => Promise<void>;
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
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [completingOAuth, setCompletingOAuth] = useState(false);

  // Handle the return from a Google OAuth redirect. Supabase may land the user
  // on any allow-listed URL (or the Site URL when no redirect matches), so this
  // runs app-wide rather than being tied to the login page.
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Password-recovery links (also `?code=`) are handled on that page.
    if (window.location.pathname === "/reset-password") return;

    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get("error_description") ?? params.get("error");
    const code = params.get("code");
    if (!oauthError && !code) return;

    const cleanUrl = window.location.pathname + window.location.hash;

    if (oauthError) {
      const message = decodeURIComponent(oauthError.replace(/\+/g, " "));
      window.sessionStorage.setItem(OAUTH_ERROR_KEY, message);
      window.history.replaceState({}, "", cleanUrl);
      navigate({ to: "/login" });
      return;
    }

    setCompletingOAuth(true);
    let cancelled = false;

    const redirectByRole = (role: Role) => {
      if (role === "admin") navigate({ to: "/admin" });
      else if (role === "teacher") navigate({ to: "/teacher" });
      else navigate({ to: "/student" });
    };

    (async () => {
      // detectSessionInUrl exchanges the code for a session asynchronously;
      // poll until it lands.
      for (let i = 0; i < 25 && !cancelled; i++) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (cancelled) return;

        if (session?.user) {
          // Profile is auto-created by the handle_new_user DB trigger; retry
          // briefly in case it hasn't committed yet.
          let role: Role = "student";
          for (let j = 0; j < 6 && !cancelled; j++) {
            const p = await fetchProfile(session.user.id);
            if (cancelled) return;
            if (p) {
              role = p.role;
              break;
            }
            await new Promise((r) => setTimeout(r, 400));
          }
          if (cancelled) return;
          window.history.replaceState({}, "", cleanUrl);
          redirectByRole(role);
          setCompletingOAuth(false);
          return;
        }

        await new Promise((r) => setTimeout(r, 400));
      }

      if (!cancelled) {
        window.sessionStorage.setItem(
          OAUTH_ERROR_KEY,
          "Google sign-in could not be completed. Please try again.",
        );
        window.history.replaceState({}, "", cleanUrl);
        setCompletingOAuth(false);
        navigate({ to: "/login" });
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

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

  const signInWithGoogle = async () => {
    // Return to the same page we started from (login or register) so the user
    // sees the spinner reappear on the button rather than a separate screen.
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}${window.location.pathname}`
        : undefined;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) throw error;
    // On success the browser is redirected to Google, so nothing else runs here.
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
    <AuthCtx.Provider value={{ user, profile, loading, login, signInWithGoogle, logout, register }}>
      {children}
      {completingOAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Completing sign-in…
          </p>
        </div>
      )}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
