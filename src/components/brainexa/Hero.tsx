import {
  PlayCircle,
  Sparkles,
  CheckCircle2,
  BookOpen,
  MessageCircle,
  TrendingUp,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const TRUST = [
  "Class 9 & 10 Science",
  "Free Demo Available",
  "Premium Course ₹299",
  "24/7 Learning Support",
];

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative overflow-hidden"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -top-24 right-0 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald/15 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-24 lg:grid lg:grid-cols-12 lg:gap-12 lg:px-8 lg:pt-20">
        <div className="lg:col-span-6 lg:pr-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            CBSE Board Preparation
          </span>
          <h1
            id="hero-title"
            className="mt-5 text-4xl font-extrabold tracking-tight text-balance text-foreground sm:text-5xl md:text-6xl"
          >
            Master Class 9 & 10 Science with{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Brainexa
            </span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Concept clarity, board-focused preparation, quizzes, notes, and
            doubt support — all designed for school students who want to score
            their best.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="h-12 px-6 text-base bg-gradient-gold text-gold-foreground hover:opacity-90 shadow-gold"
            >
              <Link to="/courses">
                <PlayCircle className="h-5 w-5" />
                Start Free Demo
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-12 px-6 text-base border-2 border-foreground/15 hover:bg-foreground/5"
            >
              <Link to="/courses" search={{ type: "premium" }}>
                Buy Premium ₹299
              </Link>
            </Button>
          </div>

          <ul className="mt-8 flex flex-wrap gap-2.5">
            {TRUST.map((t) => (
              <li
                key={t}
                className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-soft ring-1 ring-border"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Dashboard mock */}
        <div className="relative mt-12 lg:col-span-6 lg:mt-0">
          <DashboardMock />
        </div>
      </div>
    </section>
  );
}

function DashboardMock() {
  return (
    <div className="relative mx-auto max-w-md lg:max-w-none">
      {/* Floating chips */}
      <div className="absolute -top-4 -left-2 z-20 hidden rounded-2xl bg-card px-3 py-2 shadow-elevated ring-1 ring-border sm:flex sm:items-center sm:gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald/15">
          <TrendingUp className="h-4 w-4 text-emerald" />
        </span>
        <div className="text-left">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Avg. Score
          </p>
          <p className="text-sm font-bold text-foreground">+28% ↑</p>
        </div>
      </div>
      <div className="absolute -bottom-4 -right-2 z-20 hidden rounded-2xl bg-card px-3 py-2 shadow-elevated ring-1 ring-border sm:flex sm:items-center sm:gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/20">
          <Sparkles className="h-4 w-4 text-gold" />
        </span>
        <div className="text-left">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Just ₹299
          </p>
          <p className="text-sm font-bold text-foreground">Save 70%</p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-gradient-navy p-5 shadow-elevated sm:p-7">
        {/* Mock card grid pattern */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-navy-foreground/60">
                Welcome back
              </p>
              <p className="mt-0.5 text-lg font-bold text-navy-foreground">
                Class 10 Science
              </p>
            </div>
            <span className="rounded-full bg-emerald/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald">
              Live
            </span>
          </div>

          {/* Video lesson tile */}
          <div className="mt-5 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="flex items-center gap-3">
              <div className="relative flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-glow to-primary">
                <PlayCircle className="h-7 w-7 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-navy-foreground">
                  Chemical Reactions & Equations
                </p>
                <p className="mt-0.5 text-xs text-navy-foreground/60">
                  Chapter 1 · Video Lesson · 24 min
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-3/5 rounded-full bg-gradient-gold" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium uppercase tracking-wider text-navy-foreground/60">
                  Quiz Score
                </span>
                <span className="text-[10px] font-bold text-emerald">
                  +12%
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold text-navy-foreground">
                86<span className="text-base text-navy-foreground/40">/100</span>
              </p>
              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className={`h-1.5 flex-1 rounded-full ${
                      i <= 4 ? "bg-gold" : "bg-white/15"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/30">
                  <BookOpen className="h-3.5 w-3.5 text-navy-foreground" />
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-navy-foreground/60">
                  Notes
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-navy-foreground">
                14 PDFs ready
              </p>
              <p className="mt-0.5 text-[11px] text-navy-foreground/60">
                Updated today
              </p>
            </div>
          </div>

          {/* Doubt support row */}
          <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald/20">
              <MessageCircle className="h-4 w-4 text-emerald" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-navy-foreground">
                Doubt answered in 2 min
              </p>
              <p className="truncate text-[11px] text-navy-foreground/60">
                "Difference between displacement & double displacement?"
              </p>
            </div>
          </div>

          {/* Overall progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-[11px] text-navy-foreground/70">
              <span>Course progress</span>
              <span className="font-semibold text-navy-foreground">62%</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[62%] rounded-full bg-gradient-gold" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
