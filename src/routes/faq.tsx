import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/brainexa/Navbar";
import { Footer } from "@/components/brainexa/Footer";
import { SectionHeading } from "@/components/brainexa/SectionHeading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Brainexa" },
      { name: "description", content: "Answers to common questions about Brainexa courses, pricing, doubt support and referrals." },
    ],
  }),
  component: FaqPage,
});

const FAQS = [
  { q: "Is there a free demo course?", a: "Yes — both Class 9 and Class 10 Science have free demo courses with sample video lessons and basic quizzes." },
  { q: "Which classes are covered?", a: "Brainexa currently covers Class 9 and Class 10 Science with complete board-aligned preparation." },
  { q: "What is included in the premium course?", a: "Full syllabus video lessons, downloadable notes, chapter-wise quizzes, doubt support and board-focused practice." },
  { q: "How much does the premium course cost?", a: "₹299 — a one-time payment for full course access (limited launch offer)." },
  { q: "How can I ask doubts?", a: "Premium students get 24/7 doubt support through the dashboard or our WhatsApp/Telegram community." },
  { q: "How does Refer & Earn work?", a: "Earn up to 12.5% across 3 levels — 7% on direct (Level 1) referrals, 3% on Level 2, and 2.5% on Level 3." },
];

function FaqPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
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
            <AccordionItem key={f.q} value={`item-${i}`} className="border-border last:border-b-0 px-4">
              <AccordionTrigger className="py-5 text-left text-base font-semibold text-foreground hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
      <Footer />
    </div>
  );
}
