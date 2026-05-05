import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/brainexa/Navbar";
import { Footer } from "@/components/brainexa/Footer";
import { SectionHeading } from "@/components/brainexa/SectionHeading";
// import { GraduationCap, Sparkles, Target, Compass, Road } from "lucide-react";
import {
  GraduationCap,
  Sparkles,
  Target,
  Compass,
  Route as RouteIcon,
} from "lucide-react";
import type { ReactNode, ComponentType } from "react";
import { Logo } from "@/components/brainexa/Logo";
import founderImage from "@/assets/founder-sanjeev-gupta.jpeg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      {
        title: "About BRAINEXA — Founder Sanjeev Gupta | Class 9 & 10 Science",
      },
      {
        name: "description",
        content:
          "BRAINEXA is a digital learning platform founded by Sanjeev Gupta, M.Sc. (Organic Chemistry), B.Ed., with 15+ years of CBSE teaching experience.",
      },
      { property: "og:title", content: "About BRAINEXA" },
      {
        property: "og:description",
        content:
          "Concept-based, exam-oriented Science education for Classes 9 and 10, built on 15+ years of CBSE classroom experience.",
      },
    ],
  }),
  component: AboutPage,
});

const APPROACH = [
  "Clear and strong conceptual understanding",
  "Step-by-step explanation of important topics",
  "Practice with exam-oriented and competency-based questions",
  "Development of logical thinking and problem-solving skills",
  "Structured preparation for school and board examinations",
];

const VISION = [
  "Academic courses for Classes 6 to 12",
  "Science and Mathematics concept mastery",
  "Board examination preparation",
  "Competitive exam preparation",
  "A team of qualified and experienced educators across multiple subjects",
];

const MISSION = [
  "The mission of BRAINEXA is to help students understand concepts deeply, perform well in examinations, and develop a genuine interest in learning.",
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="About Us"
          logo={<Logo size="lg" clickable={false} />}
          title="About BRAINEXA"
          subtitle="Shaping intelligent futures through concept-first learning."
        />

        <div className="mt-10 space-y-6">
          <Card>
            <p>
              BRAINEXA is a modern digital learning platform dedicated to making
              quality education simple, structured, and accessible for students.
            </p>
          </Card>

          <Card>
            <div className="grid gap-6 md:grid-cols-[240px_1fr] md:items-center">
              <div className="mx-auto w-full max-w-60 overflow-hidden rounded-2xl bg-muted ring-1 ring-border shadow-soft">
                <img
                  src={founderImage}
                  alt="Sanjeev Gupta, Founder of BRAINEXA"
                  className="aspect-4/5 w-full object-cover object-top"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  <Badge icon={GraduationCap} />
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      Founder — Sanjeev Gupta
                    </h2>
                    <p className="mt-1 text-sm font-medium text-primary">
                      M.Sc. Organic Chemistry • B.Ed. Science • 15+ Years
                      Teaching Experience
                    </p>
                  </div>
                </div>

                <p>
                  The platform was founded by{" "}
                  <strong className="text-foreground">Sanjeev Gupta</strong>, an
                  experienced educator with strong academic qualifications in
                  science. He holds an{" "}
                  <strong className="text-foreground">
                    M.Sc. in Organic Chemistry
                  </strong>{" "}
                  and a{" "}
                  <strong className="text-foreground">B.Ed. (Science)</strong>,
                  reflecting both deep subject expertise and professional
                  teaching training.
                </p>

                <p>
                  With more than{" "}
                  <strong className="text-foreground">
                    15 years of teaching experience
                  </strong>{" "}
                  in CBSE-affiliated schools and educational institutions, he
                  has guided thousands of students in developing strong
                  conceptual understanding and achieving success in board
                  examinations.
                </p>

                <p>
                  Based on years of classroom teaching experience and a deep
                  understanding of student learning challenges, BRAINEXA was
                  created to simplify learning and provide concept-based,
                  exam-oriented education for students.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-4">
              <Badge icon={Sparkles} />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground">
                  Our Learning Approach
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {APPROACH.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-4">
              <Badge icon={Target} />
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Current Offerings
                </h2>
                <p className="mt-3">
                  BRAINEXA currently offers courses focused on{" "}
                  <strong className="text-foreground">
                    Science education for Classes 9 and 10
                  </strong>
                  , designed to help students understand concepts clearly and
                  perform confidently in CBSE board examinations.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-4">
              <Badge icon={Compass} />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground">
                  Our Vision
                </h2>
                <p className="mt-3">
                  The long-term vision of BRAINEXA is to grow into a
                  comprehensive learning ecosystem that supports students
                  throughout their academic journey. In the coming years, the
                  platform aims to expand its learning programs to include:
                </p>
                <ul className="mt-4 space-y-2.5">
                  {VISION.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-4">
              {/* <Badge icon={Road} /> */}
              <Badge icon={RouteIcon} />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground">
                  Our Mission
                </h2>

                <p>
                  By combining experienced teaching, structured content, and
                  technology-enabled learning, BRAINEXA aims to create a
                  reliable and student-friendly learning platform where students
                  can learn with clarity, practice effectively, and build
                  confidence in their studies.
                </p>
                <p className="mt-4 font-semibold text-foreground">
                  {MISSION.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <h2 className="text-2xl font-extrabold text-foreground">
                Start learning with BRAINEXA
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Explore structured Science courses for Classes 9 and 10 and
                begin your concept-first preparation today.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/courses"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-gold px-5 py-3 text-sm font-semibold text-gold-foreground shadow-gold transition-opacity hover:opacity-90"
                >
                  Explore Courses
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-card p-6 text-base leading-relaxed text-muted-foreground ring-1 ring-border shadow-soft sm:p-8">
      {children}
    </div>
  );
}

function Badge({
  icon: Icon,
}: {
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
      <Icon className="h-5 w-5" />
    </span>
  );
}
