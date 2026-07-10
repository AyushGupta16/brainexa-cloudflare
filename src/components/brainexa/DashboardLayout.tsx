import { Link, useNavigate } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/brainexa/ThemeToggle";
import { Logo } from "@/components/brainexa/Logo";
import { HoverGroup } from "@/components/brainexa/DashboardUI";
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
  /** Optional right-hand agenda/queue rail (shown on xl+ screens). */
  aside?: ReactNode;
  requireRole?: "admin" | "teacher" | "student";
}

export function DashboardLayout({ title, nav, children, aside, requireRole }: Props) {
  const { user, profile, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-sm">
          <h2 className="text-xl font-semibold mb-2">Loading…</h2>
          <p className="text-muted-foreground text-sm">
            Preparing your dashboard.
          </p>
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
          <p className="text-muted-foreground text-sm">
            Finishing account setup.
          </p>
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

  const initials =
    profile.name
      ?.split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-app overflow-x-clip">
      <header className="bg-card/80 backdrop-blur border-b sticky top-0 z-30">
        <div className="container mx-auto px-4 h-18 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link to="/" className="flex items-center gap-2.5 group" aria-label="BRAINEXA home">
              <Logo size="md" clickable={false} />
              <span className="hidden flex-col leading-tight sm:flex">
                <span className="text-base font-extrabold tracking-tight text-foreground sm:text-lg">
                  BRAINEXA
                </span>
                <span className="hidden text-[10px] font-medium uppercase tracking-wider text-muted-foreground lg:block">
                  Shaping Intelligent Futures
                </span>
              </span>
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium text-sm">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            {/* <span className="text-xs text-muted-foreground hidden sm:inline">
              {profile.name} ({profile.role})
            </span> */}
            <ThemeToggle />
            <Button variant="ghost" size="icon" asChild>
              <Link
                to={nav[0]?.to ?? "/"}
                title="Dashboard overview"
                aria-label="Dashboard overview"
              >
                <Home className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Log out"
              aria-label="Log out"
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
      <div
        className={`container mx-auto px-4 py-6 grid grid-cols-1 gap-6 xl:gap-12 md:grid-cols-[200px_minmax(0,1fr)] ${
          aside ? "xl:grid-cols-[210px_minmax(0,1fr)_330px]" : ""
        }`}
      >
        <aside className="md:sticky md:top-20">
          <nav className="bg-card/70 backdrop-blur border rounded-2xl p-3 flex md:flex-col gap-1.5 overflow-x-auto shadow-soft md:h-[calc(100dvh-7rem)]">
            <p className="hidden px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 md:block">
              Menu
            </p>
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: true }}
                activeProps={{
                  className: "bg-gradient-dash text-navy-foreground shadow-soft",
                }}
                className="flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
              >
                <span className="shrink-0 [&>svg]:h-4.5 [&>svg]:w-4.5">
                  {n.icon}
                </span>
                {n.label}
              </Link>
            ))}
            <div className="mt-auto hidden md:block">
              <div className="flex items-center gap-2.5 rounded-xl border bg-card/60 p-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-dash text-xs font-bold text-navy-foreground">
                  {initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold leading-tight">
                    {profile.name}
                  </p>
                  <p className="truncate text-xs capitalize text-muted-foreground">
                    {profile.role}
                  </p>
                </div>
              </div>
            </div>
          </nav>
        </aside>
        <main className="min-w-0">
          <HoverGroup>{children}</HoverGroup>
        </main>
        {aside && (
          <aside className="min-w-0 md:col-span-2 xl:col-span-1 xl:sticky xl:top-20 xl:h-fit">
            {aside}
          </aside>
        )}
      </div>
    </div>
  );
}
