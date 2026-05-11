import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/brainexa/Logo";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot Password — Brainexa" },
      {
        name: "description",
        content: "Reset your Brainexa account password.",
      },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (loading) return;

    if (!email) {
      setError("Please enter your registered email.");
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");

    try {
      const redirectTo = `${window.location.origin}/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setNotice(
        "Password reset link sent. Please check your email inbox and spam folder.",
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unable to send reset email.";
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
            <CardTitle className="text-2xl">Forgot Password</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="rounded-xl bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
            Enter your registered email. We will send you a secure password
            reset link.
          </p>

          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <Input
              id="reset-email"
              type="email"
              placeholder="Enter your registered email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {notice && <p className="text-sm text-emerald-600">{notice}</p>}

          <Button
            className="w-full gap-2"
            onClick={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending reset link...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
