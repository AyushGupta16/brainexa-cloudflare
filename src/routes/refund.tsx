import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/brainexa/Navbar";
import { Footer } from "@/components/brainexa/Footer";
import { SectionHeading } from "@/components/brainexa/SectionHeading";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: "Refund Policy — Brainexa" },
      { name: "description", content: "Brainexa course refund and cancellation policy." },
    ],
  }),
  component: RefundPage,
});

function RefundPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Legal" title="Refund Policy" subtitle="Last updated: 2026" />
        <div className="mt-10 space-y-5 rounded-2xl bg-card p-8 ring-1 ring-border shadow-soft text-sm leading-relaxed text-muted-foreground">
          <p>We want you to be confident in your purchase. Try the free demo course first to understand our teaching style before enrolling in premium.</p>
          <p><strong className="text-foreground">Eligibility:</strong> refund requests must be raised within 7 days of purchase, provided less than 20% of the course content has been accessed.</p>
          <p><strong className="text-foreground">Process:</strong> email support@brainexa.in with your order details. Approved refunds are processed within 7–10 business days to the original payment method.</p>
          <p><strong className="text-foreground">Non-refundable:</strong> referral commissions already credited and withdrawn are not reversible.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
