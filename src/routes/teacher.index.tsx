import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { DashboardLayout } from "@/components/brainexa/DashboardLayout";
import { enrollments, doubts, getTopic } from "@/lib/mockData";
import {
  getTeacherSubjectsForUser,
  getTeacherEarningsForUser,
} from "@/lib/coursesService";
import { Button } from "@/components/ui/button";
import {
  PageGreeting,
  StatCardGrid,
  Panel,
  AgendaItem,
  TrendChart,
} from "@/components/brainexa/DashboardUI";
import { BookOpen, Users, Wallet, TrendingUp, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/teacher/")({
  component: TeacherDashboard,
});

const NAV = [
  { to: "/teacher", label: "Overview" },
  { to: "/teacher/subjects", label: "My Subjects" },
  { to: "/teacher/earnings", label: "Earnings" },
  { to: "/teacher/doubts", label: "Doubts" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

function TeacherDashboard() {
  const { user, profile } = useAuth();
  if (!user || !profile)
    return (
      <DashboardLayout title="Teacher" nav={NAV} requireRole="teacher">
        <></>
      </DashboardLayout>
    );
  const assigned = getTeacherSubjectsForUser(user.id);
  const earnings = getTeacherEarningsForUser(user.id);
  const courseIds = new Set(assigned.map((a) => a.course.id));
  const totalStudents = enrollments.filter((e) =>
    courseIds.has(e.courseId),
  ).length;
  const subjIds = new Set(assigned.map((a) => a.subject.id));
  const pendingDoubts = doubts.filter((d) => {
    const t = getTopic(d.topicId);
    return t && subjIds.has(t.subject.id) && d.status === "pending";
  });

  const collected = earnings.paid + earnings.pending;
  const collectionPct = collected ? Math.round((earnings.paid / collected) * 100) : 0;

  // Sample 6-month earnings trend (no historical ledger in the data layer yet).
  const earningsTrend = MONTHS.map((label, i) => ({
    label,
    value: Math.round(
      (earnings.totalEarning / 6) * (0.6 + ((i * 13 + assigned.length * 5) % 50) / 100),
    ),
  }));

  const rail = (
    <div className="space-y-6">
      <Panel
        title="Doubts Queue"
        action={
          <span className="text-xs text-muted-foreground">
            {pendingDoubts.length} pending
          </span>
        }
      >
        <div className="space-y-2">
          {pendingDoubts.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No pending doubts. Nice work!
            </p>
          )}
          {pendingDoubts.slice(0, 6).map((d) => {
            const t = getTopic(d.topicId);
            return (
              <AgendaItem
                key={d.id}
                icon={<MessageCircle className="h-4 w-4" />}
                title={d.question}
                subtitle={t ? `${t.subject.title} · ${t.topic.title}` : undefined}
              />
            );
          })}
          {pendingDoubts.length > 0 && (
            <Button asChild size="sm" variant="outline" className="w-full">
              <Link to="/teacher/doubts">Open all doubts</Link>
            </Button>
          )}
        </div>
      </Panel>
    </div>
  );

  return (
    <DashboardLayout title="Teacher" nav={NAV} requireRole="teacher" aside={rail}>
      <div className="space-y-6">
        <PageGreeting
          eyebrow="Welcome"
          title={profile.name}
          subtitle="Your teaching overview at a glance."
        />

        <StatCardGrid
          className="grid-cols-2 lg:grid-cols-4"
          items={[
            {
              icon: <Wallet className="h-4 w-4" />,
              label: "My Earnings",
              value: `₹${earnings.totalEarning}`,
              progress: collectionPct,
            },
            {
              icon: <BookOpen className="h-4 w-4" />,
              label: "Assigned Subjects",
              value: assigned.length,
            },
            {
              icon: <Users className="h-4 w-4" />,
              label: "Enrolled Students",
              value: totalStudents,
            },
            {
              icon: <TrendingUp className="h-4 w-4" />,
              label: "Total Sales",
              value: `₹${earnings.totalSales}`,
            },
          ]}
        />

        <Panel
          title="Earnings Trend"
          action={<span className="text-xs text-muted-foreground">Last 6 months</span>}
        >
          <TrendChart data={earningsTrend} />
        </Panel>

        <Panel title="Earnings Breakdown">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <div className="text-xs text-muted-foreground">Paid</div>
              <div className="text-xl font-bold text-emerald">₹{earnings.paid}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Pending</div>
              <div className="text-xl font-bold text-gold">₹{earnings.pending}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Pending Doubts</div>
              <div className="text-xl font-bold">{pendingDoubts.length}</div>
            </div>
          </div>
        </Panel>

        <Panel title="My Subjects">
          <div className="space-y-2">
            {assigned.map((a) => (
              <div
                key={a.subject.id}
                className="flex items-center justify-between rounded-xl border bg-card/60 p-3"
              >
                <div className="min-w-0">
                  <div className="truncate font-medium">{a.subject.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {a.course.title} · Commission {a.commission}%
                  </div>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link to="/subjects/$subjectId" params={{ subjectId: a.subject.id }}>
                    Open
                  </Link>
                </Button>
              </div>
            ))}
            {assigned.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No subjects assigned yet.
              </p>
            )}
          </div>
        </Panel>
      </div>
    </DashboardLayout>
  );
}
