import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Shield, Users, Loader2 } from "lucide-react";
import { Logo } from "@/components/brainexa/Logo";

type LoginRole = "student" | "teacher" | "admin";

const ROLE_LABELS: Record<LoginRole, string> = {
  student: "Student",
  teacher: "Teacher",
  admin: "Admin",
};

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Brainexa" },
      { name: "description", content: "Sign in to your Brainexa account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<LoginRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectByRole = (role: LoginRole) => {
    if (role === "admin") {
      navigate({ to: "/admin" });
    } else if (role === "teacher") {
      navigate({ to: "/teacher" });
    } else {
      navigate({ to: "/student" });
    }
  };

  const ROLE_MESSAGES: Record<
    LoginRole,
    { info: string; note?: string; warning?: string }
  > = {
    student: {
      info: " Sign in as a student to access your courses, assignments, and performance analytics.",
    },
    teacher: {
      info: "Sign in as a teacher, after verifying your teacher email and password.",
      note: "Note: Teacher accounts have access to course management and student performance analytics after verifying your teacher email and password to sign in.",
    },
    admin: {
      info: "Sign in as an admin, after verifying your admin email and password.",
      warning:
        "Warning: Admin access is restricted. Ensure you have the correct credentials and permissions to access the admin dashboard.",
    },
  };

  const handleLogin = async () => {
    if (loading) return;

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const loggedInProfile = await login(email, password);
      const actualRole = loggedInProfile.role as LoginRole;

      if (actualRole !== tab) {
        setTab(actualRole);
        // setPassword(""); // Clear password to prompt re-entry for the correct role
        setError(
          `This account is registered as ${ROLE_LABELS[actualRole]}. Switched to the ${ROLE_LABELS[actualRole]} tab automatically. Please enter your password again.`,
        );
        return;
      }

      redirectByRole(actualRole);
    } catch (err: unknown) {
      let message = err instanceof Error ? err.message : "Login failed.";

      if (
        typeof message === "string" &&
        /email.*not.*confirmed/i.test(message)
      ) {
        message =
          "Please confirm your email from your inbox, then try signing in again.";
      }

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
            to="/"
            className="text-xs text-muted-foreground hover:text-primary"
          >
            ← Back to Brainexa
          </Link>

          <div className="flex items-center gap-4">
            <Logo size="xl" clickable={false} />
            <CardTitle className="text-2xl">Sign in to Brainexa</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Tabs
            value={tab}
            onValueChange={(value) => {
              setTab(value as LoginRole);
              setError("");
            }}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="student"
                className="gap-1.5 text-xs sm:text-sm"
              >
                <GraduationCap className="h-4 w-4" /> Student
              </TabsTrigger>
              <TabsTrigger
                value="teacher"
                className="gap-1.5 text-xs sm:text-sm"
              >
                <Users className="h-4 w-4" /> Teacher
              </TabsTrigger>
              <TabsTrigger value="admin" className="gap-1.5 text-xs sm:text-sm">
                <Shield className="h-4 w-4" /> Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value={tab} className="mt-4 space-y-4">
              {ROLE_MESSAGES[tab].info && (
                <p className="rounded-xl bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
                  {ROLE_MESSAGES[tab].info}
                </p>
              )}

              {ROLE_MESSAGES[tab].note && (
                <p className="rounded-xl bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
                  {ROLE_MESSAGES[tab].note}
                </p>
              )}

              {ROLE_MESSAGES[tab].warning && (
                <p className="rounded-xl bg-destructive/60 px-4 py-3 text-sm text-destructive-foreground">
                  {ROLE_MESSAGES[tab].warning}
                </p>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>

                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button
                className="w-full gap-2"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  `Sign in as ${ROLE_LABELS[tab]}`
                )}
              </Button>
            </TabsContent>
          </Tabs>

          <p className="pt-2 text-center text-sm text-muted-foreground">
            New student?{" "}
            <Link to="/register" className="text-primary underline">
              Register here →
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
