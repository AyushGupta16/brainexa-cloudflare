import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getChapter, getTestsForRef } from "@/lib/mockData";
import { Navbar } from "@/components/brainexa/Navbar";
import { Footer } from "@/components/brainexa/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, ChevronRight, ClipboardCheck, FileText } from "lucide-react";

export const Route = createFileRoute("/chapters/$chapterId")({
  component: ChapterPage,
});

function ChapterPage() {
  const { chapterId } = Route.useParams();
  const data = getChapter(chapterId);
  if (!data) throw notFound();
  const { course, subject, chapter } = data;
  const chapterTests = getTestsForRef("chapter", chapter.id);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10">
        <nav className="text-sm text-muted-foreground mb-4">
          <Link to="/courses" className="hover:text-primary">Courses</Link> /{" "}
          <Link to="/courses/$courseId" params={{ courseId: course.id }} className="hover:text-primary">
            {course.title}
          </Link>{" "}
          /{" "}
          <Link to="/subjects/$subjectId" params={{ subjectId: subject.id }} className="hover:text-primary">
            {subject.title}
          </Link>{" "}
          / <span className="text-foreground">{chapter.title}</span>
        </nav>
        <h1 className="text-3xl md:text-4xl font-bold">{chapter.title}</h1>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6 mt-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Topics</h2>
            <div className="grid gap-3">
              {chapter.topics.map((t, i) => (
                <Card key={t.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="bg-primary/10 text-primary p-2 rounded-md">
                        <PlayCircle className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-muted-foreground">Topic {i + 1}</div>
                        <div className="font-medium truncate">{t.title}</div>
                      </div>
                    </div>
                    <Button asChild size="sm">
                      <Link to="/topics/$topicId" params={{ topicId: t.id }}>
                        Start <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <aside>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4" /> Chapter Tests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {chapterTests.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No chapter test yet.</p>
                ) : (
                  chapterTests.map((t) => (
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
