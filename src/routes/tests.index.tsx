import { createFileRoute, Link } from "@tanstack/react-router";
import { tests, courses, getCourse, getSubject, getChapter, getTopic } from "@/lib/mockData";
import { Navbar } from "@/components/brainexa/Navbar";
import { Footer } from "@/components/brainexa/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck } from "lucide-react";

export const Route = createFileRoute("/tests/")({
  head: () => ({
    meta: [{ title: "Test Series — Brainexa" }],
  }),
  component: TestsIndex,
});

function describeScope(t: (typeof tests)[number]) {
  if (t.scope === "topic") {
    const d = getTopic(t.refId);
    return d ? `${d.course.title} → ${d.subject.title} → ${d.chapter.title} → ${d.topic.title}` : "";
  }
  if (t.scope === "chapter") {
    const d = getChapter(t.refId);
    return d ? `${d.course.title} → ${d.subject.title} → ${d.chapter.title}` : "";
  }
  const d = getSubject(t.refId);
  return d ? `${d.course.title} → ${d.subject.title}` : "";
}

function TestsIndex() {
  const groups: Record<string, typeof tests> = { subject: [], chapter: [], topic: [] };
  for (const t of tests) groups[t.scope].push(t);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Test Series</h1>
        <p className="text-muted-foreground mb-8">
          Subject-wise, chapter-wise and topic-wise MCQ tests for {courses.length} courses.
        </p>

        {(["subject", "chapter", "topic"] as const).map((scope) => (
          <section key={scope} className="mb-10">
            <h2 className="text-xl font-semibold mb-4 capitalize">{scope}-wise tests</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {groups[scope].map((t) => (
                <Card key={t.id}>
                  <CardHeader>
                    <Badge className="w-fit" variant="secondary">
                      {t.questions.length} questions
                    </Badge>
                    <CardTitle className="text-base flex items-center gap-2">
                      <ClipboardCheck className="h-4 w-4 text-primary" /> {t.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-3">{describeScope(t)}</p>
                    <Button asChild size="sm">
                      <Link to="/tests/$testId" params={{ testId: t.id }}>
                        Start Test
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {groups[scope].length === 0 && (
                <p className="text-sm text-muted-foreground">No tests yet.</p>
              )}
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </div>
  );
}
