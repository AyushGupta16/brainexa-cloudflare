import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/brainexa/Navbar";
import { Footer } from "@/components/brainexa/Footer";
import { SectionHeading } from "@/components/brainexa/SectionHeading";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Brainexa" },
      { name: "description", content: "How Brainexa collects, uses and protects your personal information." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Legal" title="Privacy Policy" subtitle="Last updated: 2026" />
        <div className="mt-10 space-y-5 rounded-2xl bg-card p-8 ring-1 ring-border shadow-soft text-sm leading-relaxed text-muted-foreground">
          <p>Brainexa respects your privacy. We collect only the information needed to provide our courses, manage your account and improve your learning experience.</p>
          <p><strong className="text-foreground">Information we collect:</strong> name, email, phone, payment details (processed securely by third-party gateways), and course progress data.</p>
          <p><strong className="text-foreground">How we use it:</strong> to deliver lessons, send updates, process payments, and provide doubt support.</p>
          <p><strong className="text-foreground">Sharing:</strong> we never sell your personal data. We share only with trusted service providers (payments, hosting) under strict confidentiality.</p>
          <p><strong className="text-foreground">Your rights:</strong> you may request access, correction or deletion of your data at any time by contacting support@brainexa.in.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
