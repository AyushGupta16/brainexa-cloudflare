import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/brainexa/Logo";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [{ title: "Register — Brainexa" }],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    referralCode: "",
  });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const f =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      setError("Name, email, and password are required.");
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");

    try {
      const result = await register(
        form.name,
        form.email,
        form.phone,
        form.password,
        form.referralCode || undefined,
      );

      if (!result.ok) {
        setError(result.message);
        return;
      }

      if (result.needsEmailConfirmation) {
        setNotice(
          "Account created. Please check your email to confirm your account, then sign in.",
        );
      }

      navigate({ to: "/login" });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Registration failed.";
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
            <CardTitle className="text-2xl">Create your account</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              autoComplete="name"
              value={form.name}
              onChange={f("name")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-email">Email</Label>
            <Input
              id="register-email"
              type="email"
              placeholder="Enter your email address"
              autoComplete="email"
              value={form.email}
              onChange={f("email")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              autoComplete="tel"
              value={form.phone}
              onChange={f("phone")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-password">Password</Label>
            <Input
              id="register-password"
              type="password"
              placeholder="Enter your password (Min 6 characters)"
              autoComplete="new-password"
              value={form.password}
              onChange={f("password")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="referral-code">
              Referral Code{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="referral-code"
              placeholder="e.g. ABC12345"
              value={form.referralCode}
              onChange={f("referralCode")}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {notice && <p className="text-sm text-emerald-600">{notice}</p>}

          <Button
            className="w-full"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </Button>

          <p className="pt-1 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary underline">
              Sign in →
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
