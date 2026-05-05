import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GraduationCap, Shield, Users } from "lucide-react";
import { Logo } from "@/components/brainexa/Logo";

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
  const [tab, setTab] = useState<"student" | "teacher" | "admin">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const loggedInProfile = await login(email, password);

      if (loggedInProfile.role === "admin") {
        navigate({ to: "/admin" });
      } else if (loggedInProfile.role === "teacher") {
        navigate({ to: "/teacher" });
      } else {
        navigate({ to: "/student" });
      }
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
    <div className="relative min-h-screen flex items-center justify-center bg-background p-4 overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
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
            <Logo size="xl" />
            <CardTitle className="text-2xl">Sign in to Brainexa</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger
                value="student"
                className="text-xs sm:text-sm gap-1.5"
              >
                <GraduationCap className="h-4 w-4" /> Student
              </TabsTrigger>
              <TabsTrigger
                value="teacher"
                className="text-xs sm:text-sm gap-1.5"
              >
                <Users className="h-4 w-4" /> Teacher
              </TabsTrigger>
              <TabsTrigger value="admin" className="text-xs sm:text-sm gap-1.5">
                <Shield className="h-4 w-4" /> Admin
              </TabsTrigger>
            </TabsList>

            {(["student", "teacher", "admin"] as const).map((r) => (
              <TabsContent key={r} value={r} className="space-y-3 mt-4">
                <div className="space-y-2">
                  <Label htmlFor={`email-${r}`}>Email</Label>
                  <Input
                    id={`email-${r}`}
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`password-${r}`}>Password</Label>
                  <Input
                    id={`password-${r}`}
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button
                  className="w-full"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? "Signing in..." : `Sign in as ${r}`}
                </Button>
              </TabsContent>
            ))}
          </Tabs>

          <p className="text-sm text-center text-muted-foreground pt-2">
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
