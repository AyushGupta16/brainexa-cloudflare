import { Send, MessageCircle, Mail } from "lucide-react";
import {
  FaWhatsapp,
  FaInstagram,
  FaYoutube,
  FaFacebook,
} from "react-icons/fa6";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brainexa/Logo";

const QUICK_LINKS: {
  to: "/" | "/courses" | "/about" | "/faq" | "/contact";
  label: string;
}[] = [
  { to: "/courses", label: "Courses" },
  { to: "/about", label: "About Us" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

const LEGAL: { to: "/privacy" | "/terms" | "/refund"; label: string }[] = [
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms and Conditions" },
  { to: "/refund", label: "Refund Policy" },
];

const SOCIALS = [
  {
    label: "Email",
    icon: Mail,
    href: "mailto:support@brainexa.in",
  },
  {
    label: "WhatsApp",
    icon: FaWhatsapp,
    href: "https://chat.whatsapp.com/GsimlmjDJli0COBP9852Er?mode=gi_t",
  },
  {
    label: "Telegram",
    icon: Send,
    href: "https://t.me/BRAINEXA",
  },
  {
    label: "YouTube",
    icon: FaYoutube,
    href: "https://youtube.com/@brainexaofficial34",
  },
  {
    label: "Instagram",
    icon: FaInstagram,
    href: "https://www.instagram.com/sanjeevgupta34v",
  },
  {
    label: "Facebook",
    icon: FaFacebook,
    href: "https://www.facebook.com/share/1HdHGUvTW4/",
  },
];

export function Footer() {
  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <Logo size="2xl" />
              <span className="flex flex-col leading-tight">
                <span className="text-lg font-extrabold">BRAINEXA</span>
                <span className="text-[10px] uppercase tracking-wider text-navy-foreground/60">
                  Shaping Intelligent Futures
                </span>
              </span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-navy-foreground/70">
              Class 9 & 10 Science complete preparation — concept-first lessons,
              quizzes, notes and doubt support designed to help students score
              their best in board exams.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-navy-foreground/80 ring-1 ring-white/10 transition-colors hover:bg-white/10 hover:text-gold"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gold">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-sm text-navy-foreground/70 transition-colors hover:text-navy-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gold">
              Legal
            </h4>
            <ul className="mt-4 space-y-2.5">
              {LEGAL.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-sm text-navy-foreground/70 transition-colors hover:text-navy-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-navy-foreground/60 sm:text-left">
          © 2026 BRAINEXA. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
