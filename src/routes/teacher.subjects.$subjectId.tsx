import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { DashboardLayout } from "@/components/brainexa/DashboardLayout";
import { TEACHER_NAV as NAV } from "@/components/brainexa/dashboardNav";
import { getSubject } from "@/lib/mockData";
import { useCourses, canTeacherEditSubject } from "@/lib/coursesService";
import { ChapterManager } from "@/components/brainexa/course/ChapterManager";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/teacher/subjects/$subjectId")({
  component: TeacherSubjectManage,
});

const NAV = [
  { to: "/teacher", label: "Overview" },
  { to: "/teacher/subjects", label: "My Subjects" },
  { to: "/teacher/earnings", label: "Earnings" },
  { to: "/teacher/doubts", label: "Doubts" },
];

function TeacherSubjectManage() {
  const { subjectId } = Route.useParams();
  const { user } = useAuth();
  // Subscribe to course-data changes so chapter/topic edits re-render.
  useCourses();
  const data = getSubject(subjectId);
  const allowed = !!user && canTeacherEditSubject(user.id, subjectId);

  if (!data || !allowed) {
    return (
      <DashboardLayout title="Manage Content" nav={NAV} requireRole="teacher">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold mb-1">Access denied</h2>
            <p className="text-sm text-muted-foreground mb-4">
              This subject is not assigned to you.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/teacher/subjects">Back to my subjects</Link>
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const { course, subject } = data;

  return (
    <DashboardLayout title="Manage Content" nav={NAV} requireRole="teacher">
      <div className="mb-4">
        <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
          <Link to="/teacher/subjects">
            <ChevronLeft className="h-4 w-4 mr-1" /> My Subjects
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{subject.title}</h1>
        <p className="text-sm text-muted-foreground">{course.title}</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <ChapterManager subject={subject} />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
