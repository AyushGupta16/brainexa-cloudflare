import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { DashboardLayout } from "@/components/brainexa/DashboardLayout";
import { getTeacherSubjects } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/teacher/subjects")({
  component: TeacherSubjects,
});

const NAV = [
  { to: "/teacher", label: "Overview" },
  { to: "/teacher/subjects", label: "My Subjects" },
  { to: "/teacher/earnings", label: "Earnings" },
  { to: "/teacher/doubts", label: "Doubts" },
];

function TeacherSubjects() {
  const { user } = useAuth();
  const assigned = user ? getTeacherSubjects(user.id) : [];
  return (
    <DashboardLayout title="My Subjects" nav={NAV} requireRole="teacher">
      <h1 className="text-2xl font-bold mb-4">My Assigned Subjects</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {assigned.map((a) => (
          <Card key={a.subject.id}>
            <CardContent className="p-4">
              <div className="font-semibold">{a.subject.title}</div>
              <div className="text-xs text-muted-foreground">{a.course.title}</div>
              <div className="text-xs mt-1">Commission: <span className="font-medium">{a.commission}%</span></div>
              <div className="text-xs">Chapters: {a.subject.chapters.length}</div>
              <Button asChild size="sm" className="mt-3">
                <Link to="/subjects/$subjectId" params={{ subjectId: a.subject.id }}>Manage Content</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
