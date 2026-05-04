import { createFileRoute } from "@tanstack/react-router";
import {
  GraduationCap,
  BookOpen,
  Brain,
  Headphones,
  PlayCircle,
  Lightbulb,
  ClipboardCheck,
  Trophy,
  Users,
  BadgePercent,
  Share2,
  Infinity as InfinityIcon,
  ArrowRight,
  Sparkles,
  MessageCircle,
  Send,
  Youtube,
  Instagram,
  Facebook,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Navbar } from "@/components/brainexa/Navbar";
import { Hero } from "@/components/brainexa/Hero";
import { SectionHeading } from "@/components/brainexa/SectionHeading";
import { CourseCard } from "@/components/brainexa/CourseCard";
import { FeatureCard } from "@/components/brainexa/FeatureCard";
import { TestimonialCard } from "@/components/brainexa/TestimonialCard";
import { JourneyStep } from "@/components/brainexa/JourneyStep";
import { MobileCtaBar } from "@/components/brainexa/MobileCtaBar";
import { Footer } from "@/components/brainexa/Footer";



export const Route = createFileRoute("/")({
  component: HomePage,
});

const COURSES = [
  {
    title: "Class 9 Science Demo Course",
    classLabel: "Class 9 · Demo",
    tier: "free" as const,
    features: ["Sample video lessons", "Basic quizzes", "Course preview"],
    ctaLabel: "Start Free Demo",
  },
  {
    title: "Class 10 Science Demo Course",
    classLabel: "Class 10 · Demo",
    tier: "free" as const,
    features: ["Sample video lessons", "Basic quizzes", "Course preview"],
    ctaLabel: "Start Free Demo",
  },
  {
    title: "Class 9 Science Premium Course",
    classLabel: "Class 9 · Premium",
    tier: "premium" as const,
    features: [
      "Full syllabus coverage",
      "Video lessons",
      "Notes and quizzes",
      "Doubt support",
    ],
    ctaLabel: "Enroll Now",
  },
  {
    title: "Class 10 Science Premium Course",
    classLabel: "Class 10 · Premium",
    tier: "premium" as const,
    features: [
      "Full syllabus coverage",
      "Video lessons",
      "Notes and quizzes",
      "Board-focused preparation",
    ],
    ctaLabel: "Enroll Now",
    highlighted: true,
  },
];

const FEATURES = [
  {
    icon: GraduationCap,
    title: "Expert Faculty",
    description: "Experienced teachers focused on board exam preparation.",
  },
  {
    icon: BookOpen,
    title: "Comprehensive Curriculum",
    description: "Complete syllabus coverage with clear concept explanations.",
  },
  {
    icon: Brain,
    title: "Interactive Quizzes",
    description: "Practice regularly with quizzes and performance checks.",
  },
  {
    icon: Headphones,
    title: "24/7 Learning Support",
    description: "Get help and guidance whenever you need it.",
  },
];

const JOURNEY = [
  { icon: PlayCircle, title: "Start Free Demo", description: "Try sample lessons at no cost." },
  { icon: Lightbulb, title: "Learn Concepts", description: "Build clarity with concept-first videos." },
  { icon: ClipboardCheck, title: "Practice Quizzes", description: "Test yourself and track progress." },
  { icon: Trophy, title: "Score Better", description: "Walk into your boards confident." },
];

const TESTIMONIALS = [
  {
    name: "Shweta Mishra",
    role: "Class 10 Student",
    quote: "Brainexa classes helped me understand science concepts clearly.",
  },
  {
    name: "Rahul Verma",
    role: "Class 9 Student",
    quote: "Brainexa classes helped me understand science concepts easily.",
  },
];

const REFERRAL = [
  { icon: Users, label: "Invite Friends" },
  { icon: BadgePercent, label: "Earn up to 12.5% Commission" },
  { icon: Share2, label: "Share Referral Link" },
  { icon: InfinityIcon, label: "Unlimited Earning" },
];

const SOCIALS = [
  { label: "WhatsApp Group", icon: MessageCircle, href: "https://chat.whatsapp.com/GsimlmjDJli0COBP9852Er", tone: "emerald" as const },
  { label: "Telegram Channel", icon: Send, href: "https://t.me/BRAINEXA", tone: "primary" as const },
  { label: "YouTube", icon: Youtube, href: "https://youtube.com/@brainexaofficial34", tone: "rose" as const },
  { label: "Instagram", icon: Instagram, href: "https://www.instagram.com/sanjeevgupta34v", tone: "gold" as const },
  { label: "Facebook", icon: Facebook, href: "https://www.facebook.com/share/1HdHGUvTW4/", tone: "primary" as const },
];

const FAQS = [
  {
    q: "Is there a free demo course?",
    a: "Yes — both Class 9 and Class 10 Science have free demo courses with sample video lessons and basic quizzes so you can try Brainexa before enrolling.",
  },
  {
    q: "Which classes are covered?",
    a: "Brainexa currently focuses on Class 9 and Class 10 Science with complete board-aligned preparation.",
  },
  {
    q: "What is included in the premium course?",
    a: "Full syllabus video lessons, downloadable notes, chapter-wise quizzes, doubt support and board-focused practice — everything you need to score better.",
  },
  {
    q: "How much does the premium course cost?",
    a: "The premium course is available at a special launch price of just ₹299 — a one-time payment for full course access.",
  },
  {
    q: "How can I ask doubts?",
    a: "Premium students get 24/7 doubt support. Ask through the dashboard or join our WhatsApp/Telegram community for quick help from mentors.",
  },
  {
    q: "How does Refer & Earn work?",
    a: "Login to your dashboard, copy your unique referral link and share it. You earn up to 12.5% across 3 levels — 7% on direct (Level 1) referrals, 3% on Level 2, and 2.5% on Level 3.",
  },
];

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pb-24 md:pb-0">
        <Hero />

        {/* Launch Offer */}
        <section
          aria-labelledby="launch-title"
          className="relative overflow-hidden bg-gradient-navy py-16 sm:py-20"
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-10 md:grid-cols-2">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold">
                  <Sparkles className="h-3.5 w-3.5" />
                  Limited-time Launch Offer
                </span>
                <h2
                  id="launch-title"
                  className="mt-4 text-3xl font-extrabold tracking-tight text-navy-foreground sm:text-4xl md:text-5xl"
                >
                  Special{" "}
                  <span className="bg-gradient-gold bg-clip-text text-transparent">
                    Launch Offer
                  </span>
                </h2>
                <p className="mt-3 text-base leading-relaxed text-navy-foreground/75">
                  Get the complete premium Science course for an unbeatable price.
                  Lock in lifetime access before the offer ends.
                </p>
                <div className="mt-6">
                  <Button
                    asChild
                    size="lg"
                    className="h-12 px-8 text-base bg-gradient-gold text-gold-foreground hover:opacity-90 shadow-gold"
                  >
                    <Link to="/courses">
                      Enroll Now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-sm sm:p-8">
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-extrabold text-navy-foreground sm:text-6xl">
                    ₹299
                  </span>
                </div>
                <span className="mt-3 inline-flex rounded-full bg-gold/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold">
                  Limited Offer
                </span>
                <ul className="mt-5 space-y-2.5 text-sm text-navy-foreground/80">
                  {[
                    "One-time payment, full access",
                    "All chapters + quizzes + notes",
                    "Doubt support included",
                    "Board-focused preparation",
                  ].map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Courses */}
        <section
          id="courses"
          aria-labelledby="courses-title"
          className="py-16 sm:py-24"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Our Courses"
              title="Choose Your Science Course"
              subtitle="Start free, then unlock the complete syllabus when you're ready."
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {COURSES.map((c) => (
                <CourseCard key={c.title} {...c} />
              ))}
            </div>
          </div>
        </section>

        {/* Why Brainexa */}
        <section
          id="why"
          aria-labelledby="why-title"
          className="bg-secondary/50 py-16 sm:py-24"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Why Brainexa"
              title="Why Students Choose Brainexa"
              subtitle="Everything a Class 9 or 10 student needs — under one roof."
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f) => (
                <FeatureCard key={f.title} {...f} />
              ))}
            </div>
          </div>
        </section>

        {/* Learning Journey */}
        <section aria-labelledby="journey-title" className="py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="The Path"
              title="Your Learning Journey"
              subtitle="A simple four-step path from your first lesson to a confident exam."
            />
            <div className="mt-14 flex flex-col md:flex-row md:items-start md:gap-2">
              {JOURNEY.map((s, i) => (
                <JourneyStep
                  key={s.title}
                  step={i + 1}
                  icon={s.icon}
                  title={s.title}
                  description={s.description}
                  isLast={i === JOURNEY.length - 1}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section
          id="reviews"
          aria-labelledby="reviews-title"
          className="bg-secondary/50 py-16 sm:py-24"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Student Reviews"
              title="What Students Say"
              subtitle="Real feedback from students preparing with Brainexa."
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {TESTIMONIALS.map((t) => (
                <TestimonialCard key={t.name} {...t} />
              ))}
            </div>
          </div>
        </section>

        {/* Refer & Earn (dark CTA card) */}
        <section aria-labelledby="refer-title" className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-navy p-8 shadow-elevated sm:p-12">
              <div
                aria-hidden
                className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/15 blur-3xl"
              />
              <div
                aria-hidden
                className="absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-primary/30 blur-3xl"
              />
              <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold">
                    Refer & Earn
                  </span>
                  <h2
                    id="refer-title"
                    className="mt-4 text-3xl font-extrabold tracking-tight text-navy-foreground sm:text-4xl"
                  >
                  Refer Friends &{" "}
                    <span className="bg-gradient-gold bg-clip-text text-transparent">
                      Earn up to 12.5%
                    </span>
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-navy-foreground/75">
                    Invite friends to Brainexa and earn across 3 levels —
                    {" "}<strong className="text-navy-foreground">7%</strong> on direct (Level 1),
                    {" "}<strong className="text-navy-foreground">3%</strong> on Level 2, and
                    {" "}<strong className="text-navy-foreground">2.5%</strong> on Level 3.
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-navy-foreground/70">
                    When your friend joins using your link, you earn 7%. If their referral joins, you earn 3%. If the third level joins, you earn 2.5%.
                  </p>
                  <p className="mt-3 text-sm italic text-gold/90">
                    Login करें और Dashboard से अपना referral link copy करें.
                  </p>
                  <div className="mt-6">
                    <Button
                      asChild
                      size="lg"
                      className="h-12 px-7 text-base bg-gradient-gold text-gold-foreground hover:opacity-90 shadow-gold"
                    >
                      <Link to="/login">
                        Login & Start Earning
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <ul className="grid grid-cols-2 gap-3 sm:gap-4">
                  {REFERRAL.map((r) => (
                    <li
                      key={r.label}
                      className="flex flex-col items-start gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 transition-colors hover:bg-white/10 sm:p-5"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold">
                        <r.icon className="h-5 w-5" />
                      </span>
                      <span className="text-sm font-semibold text-navy-foreground">
                        {r.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Community */}
        <section aria-labelledby="community-title" className="py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Community"
              title="Join the Brainexa Community"
              subtitle="Connect with fellow students and stay updated with new lessons."
            />
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-card px-5 py-3 text-sm font-semibold text-foreground ring-1 ring-border shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elevated"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <s.icon className="h-4 w-4" />
                  </span>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          aria-labelledby="faq-title"
          className="bg-secondary/50 py-16 sm:py-24"
        >
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Help Center"
              title="Frequently Asked Questions"
              subtitle="Everything you need to know before you enroll."
            />
            <Accordion
              type="single"
              collapsible
              className="mt-10 rounded-2xl bg-card p-2 ring-1 ring-border shadow-soft"
            >
              {FAQS.map((f, i) => (
                <AccordionItem
                  key={f.q}
                  value={`item-${i}`}
                  className="border-border last:border-b-0 px-4"
                >
                  <AccordionTrigger className="py-5 text-left text-base font-semibold text-foreground hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Final CTA */}
        <section
          aria-labelledby="final-cta-title"
          className="relative overflow-hidden bg-gradient-navy py-20 sm:py-28"
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
          <div
            aria-hidden
            className="absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-gold/15 blur-3xl"
          />
          <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2
              id="final-cta-title"
              className="text-3xl font-extrabold tracking-tight text-balance text-navy-foreground sm:text-4xl md:text-5xl"
            >
              Ready to Start Learning Science{" "}
              <span className="bg-gradient-gold bg-clip-text text-transparent">
                Smarter?
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-navy-foreground/75 sm:text-lg">
              Join Brainexa today and begin with a free demo or unlock the full
              premium course for just ₹299.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                asChild
                variant="outline"
                className="h-12 px-7 text-base border-2 border-white/25 bg-white/5 text-navy-foreground hover:bg-white/10 hover:text-navy-foreground"
              >
                <Link to="/courses">
                  <PlayCircle className="h-5 w-5" />
                  Start Free Demo
                </Link>
              </Button>
              <Button
                size="lg"
                asChild
                className="h-12 px-7 text-base bg-gradient-gold text-gold-foreground hover:opacity-90 shadow-gold"
              >
                <Link to="/courses" search={{ type: "premium" }}>
                  Buy Premium ₹299
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileCtaBar />
    </div>
  );
}
