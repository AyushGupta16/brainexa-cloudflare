import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/brainexa/Navbar";
import { Footer } from "@/components/brainexa/Footer";
import { SectionHeading } from "@/components/brainexa/SectionHeading";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Brainexa — Class 9 & 10 Science" },
      { name: "description", content: "Learn about Brainexa's mission to help Class 9 & 10 students master Science with concept-first learning." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="About Us"
          title="About Brainexa"
          subtitle="Shaping intelligent futures, one student at a time."
        />
        <div className="mt-10 space-y-6 rounded-2xl bg-card p-8 ring-1 ring-border shadow-soft">
          <p className="text-base leading-relaxed text-muted-foreground">
            Brainexa is an edtech platform built for Class 9 and Class 10 students preparing for their board exams in Science.
            Our mission is to make concept-first learning affordable, accessible and outcome-focused.
          </p>
          <p className="text-base leading-relaxed text-muted-foreground">
            We combine experienced teachers, structured chapter-wise video lessons, downloadable notes, regular quizzes and
            24/7 doubt support so every student can study with clarity and confidence.
          </p>
          <p className="text-base leading-relaxed text-muted-foreground">
            With our Refer & Earn program, students can also earn up to 12.5% commission across 3 referral levels — turning
            learning into an opportunity.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
