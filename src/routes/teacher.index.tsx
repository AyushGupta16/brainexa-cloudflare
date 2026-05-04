import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { DashboardLayout } from "@/components/brainexa/DashboardLayout";
import {
  getTeacherSubjects,
  getTeacherEarnings,
  enrollments,
  doubts,
  getTopic,
} from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Wallet, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/teacher/")({
  component: TeacherDashboard,
});

const NAV = [
  { to: "/teacher", label: "Overview" },
  { to: "/teacher/subjects", label: "My Subjects" },
  { to: "/teacher/earnings", label: "Earnings" },
  { to: "/teacher/doubts", label: "Doubts" },
];

function TeacherDashboard() {
  const { user, profile } = useAuth();
  if (!user || !profile) return <DashboardLayout title="Teacher" nav={NAV} requireRole="teacher"><></></DashboardLayout>;
  const assigned = getTeacherSubjects(user.id);
  const earnings = getTeacherEarnings(user.id);
  const courseIds = new Set(assigned.map((a) => a.course.id));
  const totalStudents = enrollments.filter((e) => courseIds.has(e.courseId)).length;
  const subjIds = new Set(assigned.map((a) => a.subject.id));
  const pendingDoubts = doubts.filter((d) => {
    const t = getTopic(d.topicId);
    return t && subjIds.has(t.subject.id) && d.status === "pending";
  }).length;

  return (
    <DashboardLayout title="Teacher" nav={NAV} requireRole="teacher">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Welcome, {profile.name}</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={<BookOpen className="h-5 w-5" />} label="Assigned Subjects" value={assigned.length.toString()} />
          <Stat icon={<Users className="h-5 w-5" />} label="Enrolled Students" value={totalStudents.toString()} />
          <Stat icon={<TrendingUp className="h-5 w-5" />} label="Total Sales" value={`₹${earnings.totalSales}`} />
          <Stat icon={<Wallet className="h-5 w-5" />} label="My Earnings" value={`₹${earnings.totalEarning}`} />
        </div>

        <Card>
          <CardHeader><CardTitle>Earnings Breakdown</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div><div className="text-xs text-muted-foreground">Paid</div><div className="text-xl font-bold text-emerald">₹{earnings.paid}</div></div>
            <div><div className="text-xs text-muted-foreground">Pending</div><div className="text-xl font-bold text-gold">₹{earnings.pending}</div></div>
            <div><div className="text-xs text-muted-foreground">Pending Doubts</div><div className="text-xl font-bold">{pendingDoubts}</div></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>My Subjects</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {assigned.map((a) => (
              <div key={a.subject.id} className="border rounded-md p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{a.subject.title}</div>
                  <div className="text-xs text-muted-foreground">{a.course.title} · Commission {a.commission}%</div>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link to="/subjects/$subjectId" params={{ subjectId: a.subject.id }}>Open</Link>
                </Button>
              </div>
            ))}
            {assigned.length === 0 && <p className="text-sm text-muted-foreground">No subjects assigned yet.</p>}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card><CardContent className="p-4 flex items-center gap-3">
      <div className="bg-primary/10 text-primary p-2 rounded-md">{icon}</div>
      <div><div className="text-xs text-muted-foreground">{label}</div><div className="text-xl font-bold">{value}</div></div>
    </CardContent></Card>
  );
}
