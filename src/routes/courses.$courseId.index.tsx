import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getCourse } from "@/lib/mockData";
import { Navbar } from "@/components/brainexa/Navbar";
import { Footer } from "@/components/brainexa/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, BookOpen } from "lucide-react";

export const Route = createFileRoute("/courses/$courseId/")({
  component: CourseDetail,
});

function CourseDetail() {
  const { courseId } = Route.useParams();
  const course = getCourse(courseId);
  if (!course) throw notFound();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10">
        <nav className="text-sm text-muted-foreground mb-4">
          <Link to="/courses" className="hover:text-primary">
            Courses
          </Link>{" "}
          / <span className="text-foreground">{course.title}</span>
        </nav>
        <h1 className="text-3xl md:text-4xl font-bold">{course.title}</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">{course.description}</p>

        <h2 className="text-xl font-semibold mt-10 mb-4">Subjects</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {course.subjects.map((s) => (
            <Card key={s.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" /> {s.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {s.chapters.length} chapters
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/subjects/$subjectId" params={{ subjectId: s.id }}>
                    Open subject <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
