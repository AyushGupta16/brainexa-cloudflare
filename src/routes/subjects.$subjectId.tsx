import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getSubject, getTestsForRef } from "@/lib/mockData";
import { Navbar } from "@/components/brainexa/Navbar";
import { Footer } from "@/components/brainexa/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, FileText, ClipboardCheck } from "lucide-react";

export const Route = createFileRoute("/subjects/$subjectId")({
  component: SubjectPage,
});

function SubjectPage() {
  const { subjectId } = Route.useParams();
  const data = getSubject(subjectId);
  if (!data) throw notFound();
  const { course, subject } = data;
  const subjectTests = getTestsForRef("subject", subject.id);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10">
        <nav className="text-sm text-muted-foreground mb-4">
          <Link to="/courses" className="hover:text-primary">Courses</Link> /{" "}
          <Link to="/courses/$courseId" params={{ courseId: course.id }} className="hover:text-primary">
            {course.title}
          </Link>{" "}
          / <span className="text-foreground">{subject.title}</span>
        </nav>
        <h1 className="text-3xl md:text-4xl font-bold">{subject.title}</h1>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6 mt-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Chapters</h2>
            <div className="grid gap-3">
              {subject.chapters.map((ch, i) => (
                <Card key={ch.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <div className="text-xs text-muted-foreground">Chapter {i + 1}</div>
                      <div className="font-medium">{ch.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {ch.topics.length} topics
                      </div>
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link to="/chapters/$chapterId" params={{ chapterId: ch.id }}>
                        Open <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <aside className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4" /> Subject Tests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {subjectTests.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No subject test yet.</p>
                ) : (
                  subjectTests.map((t) => (
                    <Button key={t.id} asChild variant="ghost" className="w-full justify-start">
                      <Link to="/tests/$testId" params={{ testId: t.id }}>
                        <FileText className="h-4 w-4 mr-2" /> {t.title}
                      </Link>
                    </Button>
                  ))
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
