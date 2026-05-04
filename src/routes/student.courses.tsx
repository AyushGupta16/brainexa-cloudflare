import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { DashboardLayout } from "@/components/brainexa/DashboardLayout";
import { getStudentEnrollments } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/student/courses")({
  component: StudentCourses,
});

const NAV = [
  { to: "/student", label: "Overview" },
  { to: "/student/courses", label: "My Courses" },
  { to: "/student/referrals", label: "Referrals" },
  { to: "/student/doubts", label: "Doubts" },
];

function StudentCourses() {
  const { user } = useAuth();
  const enrollments = user ? getStudentEnrollments(user.id) : [];
  return (
    <DashboardLayout title="My Courses" nav={NAV} requireRole="student">
      <h1 className="text-2xl font-bold mb-4">My Courses</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {enrollments.map(({ course, enrollment }) => (
          <Card key={enrollment.id}>
            <CardContent className="p-4">
              <div className="font-semibold">{course.title}</div>
              <div className="text-xs text-muted-foreground">
                Enrolled {enrollment.date} · ₹{enrollment.amount}
              </div>
              <Button asChild size="sm" className="mt-3">
                <Link to="/courses/$courseId" params={{ courseId: course.id }}>Open</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
