import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/brainexa/Navbar";
import { Footer } from "@/components/brainexa/Footer";
import { SectionHeading } from "@/components/brainexa/SectionHeading";
import { Mail, MessageCircle, Send } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Brainexa" },
      { name: "description", content: "Get in touch with the Brainexa team for course, payment or doubt support." },
    ],
  }),
  component: ContactPage,
});

const CONTACTS = [
  { icon: Mail, label: "Email", value: "support@brainexa.in", href: "mailto:support@brainexa.in" },
  { icon: MessageCircle, label: "WhatsApp Group", value: "Join community", href: "https://chat.whatsapp.com/GsimlmjDJli0COBP9852Er" },
  { icon: Send, label: "Telegram", value: "@BRAINEXA", href: "https://t.me/BRAINEXA" },
];

function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Get in touch"
          title="Contact Us"
          subtitle="We're here to help — reach out anytime."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {CONTACTS.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-start gap-3 rounded-2xl bg-card p-6 ring-1 ring-border shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elevated"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <c.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.label}</p>
                <p className="mt-1 text-base font-bold text-foreground">{c.value}</p>
              </div>
            </a>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
