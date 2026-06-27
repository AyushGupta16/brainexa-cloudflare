import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/brainexa/Navbar";
import { Footer } from "@/components/brainexa/Footer";
import { SectionHeading } from "@/components/brainexa/SectionHeading";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowRight, BookOpen, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCommissionRates } from "@/lib/commissionRates";
import { useCourses, getGroupDisplayMode } from "@/lib/coursesService";
import type { Course } from "@/lib/mockData";

export const Route = createFileRoute("/courses/")({
  head: () => ({
    meta: [
      { title: "Courses — Brainexa" },
      { name: "description", content: "Explore complete board-aligned Science courses on Brainexa." },
    ],
  }),
  component: CoursesIndex,
});

const UNCATEGORIZED = "__uncategorized";

function CoursesIndex() {
  const { rates } = useCommissionRates();
  const total = rates.L1 + rates.L2 + rates.L3;

  const courses = useCourses();
  const active = courses.filter((c) => c.isActive !== false);
  const featuredId = active[0]?.id;

  // Group by category, preserving admin-defined order.
  const groups: { category: string; items: Course[] }[] = [];
  for (const c of active) {
    const key = c.category || UNCATEGORIZED;
    let group = groups.find((g) => g.category === key);
    if (!group) {
      group = { category: key, items: [] };
      groups.push(group);
    }
    group.items.push(c);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero band */}
        <section className="relative overflow-hidden border-b border-border">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute -top-16 right-0 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
          </div>
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <SectionHeading
              eyebrow="All Courses"
              title="Pick your course & start learning"
              subtitle="Course → Subject → Chapter → Topic. Concept-first videos, notes, quizzes and doubt support."
            />
          </div>
        </section>

        {/* Course groups */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="space-y-12">
            {groups.map((group) => {
              const isCarousel =
                group.category !== UNCATEGORIZED &&
                getGroupDisplayMode(group.category) === "carousel";
              return (
                <div key={group.category}>
                  {group.category !== UNCATEGORIZED && (
                    <h2 className="mb-5 text-xl font-bold text-foreground sm:text-2xl">
                      {group.category}
                    </h2>
                  )}

                  {isCarousel ? (
                    <Carousel opts={{ align: "start" }} className="px-1">
                      <CarouselContent className="-ml-4">
                        {group.items.map((c) => (
                          <CarouselItem
                            key={c.id}
                            className="pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/3"
                          >
                            <CourseCard course={c} featured={c.id === featuredId} />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  ) : (
                    <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {group.items.map((c) => (
                        <CourseCard key={c.id} course={c} featured={c.id === featuredId} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {groups.length === 0 && (
              <p className="text-center text-muted-foreground">
                No courses available right now. Check back soon.
              </p>
            )}
          </div>

          {/* Refer & Earn callout — consistent referral copy */}
          <div className="mt-14 rounded-2xl bg-gradient-navy p-6 text-center shadow-elevated sm:p-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold">
              <Sparkles className="h-3.5 w-3.5" />
              Refer & Earn
            </span>
            <h3 className="mt-3 text-2xl font-extrabold text-navy-foreground sm:text-3xl">
              Refer Friends & {" "}
              <span className="bg-gradient-gold bg-clip-text text-transparent">
                Earn up to {total}%
              </span>
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-navy-foreground/75">
              Level 1 (direct): <strong className="text-navy-foreground">{rates.L1}%</strong> ·
              {" "}Level 2: <strong className="text-navy-foreground">{rates.L2}%</strong> ·
              {" "}Level 3: <strong className="text-navy-foreground">{rates.L3}%</strong>
            </p>
            <Button
              asChild
              size="lg"
              className="mt-6 bg-gradient-gold text-gold-foreground hover:opacity-90 shadow-gold"
            >
              <Link to="/login">
                Login & Get Your Link
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function CourseCard({ course: c, featured }: { course: Course; featured: boolean }) {
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl bg-card ring-1 transition-all duration-300 hover:-translate-y-1",
        featured
          ? "ring-2 ring-gold shadow-gold"
          : "ring-border shadow-soft hover:shadow-elevated",
      )}
    >
      {featured && (
        <div className="absolute right-0 top-0 z-10 rounded-bl-xl bg-gradient-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-foreground">
          Featured
        </div>
      )}

      {/* Accent header */}
      <div
        className="relative bg-gradient-navy px-5 pt-6 pb-5 sm:px-6"
        style={c.color ? { backgroundColor: c.color } : undefined}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />
        {c.thumbnail && (
          <img
            aria-hidden
            src={c.thumbnail}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
        )}
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-navy-foreground/90 ring-1 ring-white/15">
            <BookOpen className="h-3 w-3" />
            {c.subjects.length} {c.subjects.length === 1 ? "subject" : "subjects"}
          </span>
          <h3 className="mt-3 text-lg font-bold leading-tight text-navy-foreground sm:text-xl">
            {c.title}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {c.description}
        </p>

        <ul className="mt-4 space-y-2">
          {[
            "Chapter-wise video lessons",
            "Notes & quizzes included",
            "Doubt support",
          ].map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-center gap-2">
          {c.price === 0 ? (
            <span className="rounded-full bg-emerald/15 px-2.5 py-1 text-xs font-bold text-emerald ring-1 ring-emerald/30">
              Free
            </span>
          ) : (
            <>
              <span className="text-2xl font-extrabold text-foreground">₹{c.price}</span>
              <span className="rounded-full bg-gold/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-foreground ring-1 ring-gold/30">
                Limited Offer
              </span>
            </>
          )}
        </div>

        <Button
          asChild
          size="lg"
          className={cn(
            "mt-5 w-full",
            featured
              ? "bg-gradient-gold text-gold-foreground hover:opacity-90"
              : "bg-foreground text-background hover:bg-foreground/90",
          )}
        >
          <Link to="/courses/$courseId" params={{ courseId: c.id }}>
            View Course
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </article>
  );
}
