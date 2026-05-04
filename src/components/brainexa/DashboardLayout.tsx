import { Link, useNavigate } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LogOut, Home } from "lucide-react";

interface NavItem {
  to: string;
  label: string;
  icon?: ReactNode;
}

interface Props {
  title: string;
  nav: NavItem[];
  children: ReactNode;
  requireRole?: "admin" | "teacher" | "student";
}

export function DashboardLayout({ title, nav, children, requireRole }: Props) {
  const { user, profile, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-sm">
          <h2 className="text-xl font-semibold mb-2">Loading…</h2>
          <p className="text-muted-foreground text-sm">Preparing your dashboard.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (typeof window !== "undefined") {
      // soft redirect via link prompt
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-sm">
          <h2 className="text-xl font-semibold mb-2">Please sign in</h2>
          <p className="text-muted-foreground text-sm mb-4">
            You need to log in to access this dashboard.
          </p>
          <Button asChild>
            <Link to="/login">Go to login</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-sm">
          <h2 className="text-xl font-semibold mb-2">Just a moment…</h2>
          <p className="text-muted-foreground text-sm">Finishing account setup.</p>
        </div>
      </div>
    );
  }

  if (requireRole && profile.role !== requireRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-sm">
          <h2 className="text-xl font-semibold mb-2">Access denied</h2>
          <p className="text-muted-foreground text-sm mb-4">
            This area is for {requireRole}s only. You are signed in as{" "}
            <span className="font-medium">{profile.role}</span>.
          </p>
          <Button asChild>
            <Link to="/login">Switch account</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b sticky top-0 z-30">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="font-bold text-primary">
              Brainexa
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium text-sm">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {profile.name} ({profile.role})
            </span>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <Home className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                logout();
                navigate({ to: "/login" });
              }}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-6 grid gap-6 md:grid-cols-[220px_1fr]">
        <aside className="md:sticky md:top-20 h-fit">
          <nav className="bg-card border rounded-lg p-2 flex md:flex-col gap-1 overflow-x-auto">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeProps={{ className: "bg-primary text-primary-foreground" }}
                className="px-3 py-2 rounded-md text-sm hover:bg-accent flex items-center gap-2 whitespace-nowrap"
              >
                {n.icon}
                {n.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
