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
    <div className="relative min-h-screen flex items-center justify-center bg-background p-4 overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
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
            <Logo size="xl" />
            <CardTitle className="text-2xl">Create your account</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              placeholder="Aman Kumar"
              value={form.name}
              onChange={f("name")}
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={f("email")}
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              type="tel"
              placeholder="9876543210"
              value={form.phone}
              onChange={f("phone")}
            />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={f("password")}
            />
          </div>
          <div className="space-y-2">
            <Label>
              Referral Code{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
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

          <p className="text-sm text-center text-muted-foreground pt-1">
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
