import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/brainexa/Logo";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{ title: "Reset Password — Brainexa" }],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    setError("");

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        setError(error.message);
        return;
      }

      if (data.session) {
        setSessionReady(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        event === "PASSWORD_RECOVERY" ||
        session ||
        window.location.hash.includes("type=recovery")
      ) {
        setSessionReady(true);
        setError("");
      }
    });

    const timeout = window.setTimeout(() => {
      setSessionReady((ready) => {
        if (!ready) {
          setError(
            "Password reset session was not found. Please request a fresh reset link.",
          );
        }

        return ready;
      });
    }, 3000);

    return () => {
      subscription.unsubscribe();
      window.clearTimeout(timeout);
    };
  }, []);

  const handleUpdatePassword = async () => {
    if (loading) return;

    if (!sessionReady) {
      setError(
        "Password reset session is not ready. Please request a fresh reset link.",
      );
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setNotice("Password updated successfully. Redirecting to login...");

      setTimeout(() => {
        navigate({ to: "/login" });
      }, 1200);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unable to update password.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />
      </div>

      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="space-y-3">
          <Link
            to="/login"
            className="text-xs text-muted-foreground hover:text-primary"
          >
            ← Back to Login
          </Link>

          <div className="flex items-center gap-4">
            <Logo size="xl" clickable={false} />
            <CardTitle className="text-2xl">Reset Password</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="rounded-xl bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
            Enter your new password below.
          </p>

          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Enter new password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm new password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUpdatePassword()}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {notice && <p className="text-sm text-emerald-600">{notice}</p>}

          <Button
            className="w-full gap-2"
            onClick={handleUpdatePassword}
            disabled={loading || !sessionReady}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating password...
              </>
            ) : !sessionReady ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Preparing reset session...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
