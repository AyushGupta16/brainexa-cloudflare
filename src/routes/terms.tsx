import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/brainexa/Navbar";
import { Footer } from "@/components/brainexa/Footer";
import { SectionHeading } from "@/components/brainexa/SectionHeading";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms and Conditions — Brainexa" },
      { name: "description", content: "Terms governing the use of Brainexa courses and platform." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Legal" title="Terms and Conditions" subtitle="Last updated: 2026" />
        <div className="mt-10 space-y-5 rounded-2xl bg-card p-8 ring-1 ring-border shadow-soft text-sm leading-relaxed text-muted-foreground">
          <p>By using Brainexa, you agree to these terms. Course content is for personal learning use only and may not be redistributed or resold.</p>
          <p><strong className="text-foreground">Accounts:</strong> you are responsible for keeping your login credentials secure.</p>
          <p><strong className="text-foreground">Payments:</strong> all course fees are payable in advance. Access is granted upon successful payment.</p>
          <p><strong className="text-foreground">Referral program:</strong> commissions (up to 12.5% across 3 levels) are credited per our published rules. Brainexa reserves the right to update referral terms.</p>
          <p><strong className="text-foreground">Conduct:</strong> abuse of the platform, sharing of paid content, or fraudulent activity will result in account termination without refund.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
