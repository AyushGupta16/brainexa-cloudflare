import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { DashboardLayout } from "@/components/brainexa/DashboardLayout";
import {
  getStudentEnrollments,
  getStudentReferralStats,
  doubts,
} from "@/lib/mockData";
import { useCommissionRates } from "@/lib/commissionRates";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PageGreeting,
  StatCardGrid,
  Panel,
  AgendaItem,
  ProgressBar,
  TrendChart,
  MiniDonut,
} from "@/components/brainexa/DashboardUI";
import { BookOpen, MessageCircle, Share2, Wallet, Copy } from "lucide-react";

export const Route = createFileRoute("/student/")({
  component: StudentDashboard,
});

const NAV = [
  { to: "/student", label: "Overview" },
  { to: "/student/courses", label: "My Courses" },
  { to: "/student/referrals", label: "Referrals" },
  { to: "/student/doubts", label: "Doubts" },
];

const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Stable pseudo-progress per course id (replaces unstable Math.random). */
function pseudoProgress(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 100;
  return 15 + (h % 70);
}

function StudentDashboard() {
  const { user, profile } = useAuth();
  const { rates: referralRates } = useCommissionRates();
  if (!user || !profile) {
    return (
      <DashboardLayout title="Student" nav={NAV} requireRole="student">
        <></>
      </DashboardLayout>
    );
  }
  const enrollments = getStudentEnrollments(user.id);
  const stats = getStudentReferralStats(user.id);
  const myDoubts = doubts.filter((d) => d.studentId === user.id);
  const referralLink = `${typeof window !== "undefined" ? window.location.origin : ""}/?ref=${profile.referral_code || user.id}`;

  const courseProgress = enrollments.map((e) => ({
    ...e,
    progress: pseudoProgress(e.course.id),
  }));
  const avgProgress = courseProgress.length
    ? Math.round(
        courseProgress.reduce((a, c) => a + c.progress, 0) /
          courseProgress.length,
      )
    : 0;

  // Sample weekly study activity (no activity log in the data layer yet).
  const seed = enrollments.length + myDoubts.length;
  const activity = WEEK.map((label, i) => ({
    label,
    value: 12 + ((i * 9 + seed * 7 + i * i * 5) % 50),
  }));

  const referralData = [
    { name: "Direct", value: stats.direct, color: "var(--color-primary)" },
    { name: "Level 2", value: stats.l2, color: "var(--color-emerald)" },
    { name: "Level 3", value: stats.l3, color: "var(--color-gold)" },
  ];
  const referralTotal = stats.direct + stats.l2 + stats.l3;

  const rail = (
    <div className="space-y-6">
      <Panel title="Recent Doubts">
        <div className="space-y-2">
          {myDoubts.length === 0 && (
            <p className="text-sm text-muted-foreground">No doubts yet.</p>
          )}
          {myDoubts.slice(0, 5).map((d) => (
            <AgendaItem
              key={d.id}
              icon={<MessageCircle className="h-4 w-4" />}
              title={d.question}
              trailing={
                <Badge variant={d.status === "answered" ? "default" : "secondary"}>
                  {d.status}
                </Badge>
              }
            />
          ))}
        </div>
      </Panel>

      <Panel title="Referral Breakdown">
        {referralTotal === 0 ? (
          <p className="text-sm text-muted-foreground">
            No referrals yet — share your link to start earning.
          </p>
        ) : (
          <>
            <MiniDonut
              data={referralData}
              centerValue={referralTotal}
              centerLabel="referrals"
            />
            <div className="mt-3 space-y-1.5">
              {referralData.map((r) => (
                <div
                  key={r.name}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: r.color }}
                    />
                    {r.name}
                  </span>
                  <span className="font-semibold">{r.value}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </Panel>
    </div>
  );

  return (
    <DashboardLayout title="Student" nav={NAV} requireRole="student" aside={rail}>
      <div className="space-y-6">
        <PageGreeting
          eyebrow="Welcome back"
          title={profile.name}
          subtitle="Here's where you left off in your learning."
        />

        <StatCardGrid
          className="grid-cols-2 lg:grid-cols-4"
          items={[
            {
              icon: <BookOpen className="h-4 w-4" />,
              label: "Enrolled Courses",
              value: enrollments.length,
              progress: avgProgress,
            },
            {
              icon: <MessageCircle className="h-4 w-4" />,
              label: "My Doubts",
              value: myDoubts.length,
            },
            {
              icon: <Share2 className="h-4 w-4" />,
              label: "Total Referrals",
              value: stats.totalReferrals,
            },
            {
              icon: <Wallet className="h-4 w-4" />,
              label: "Referral Earnings",
              value: `₹${stats.total}`,
            },
          ]}
        />

        <Panel
          title="Study Activity"
          action={
            <span className="text-xs text-muted-foreground">Last 7 days</span>
          }
        >
          <TrendChart data={activity} />
        </Panel>

        <Panel title="Continue Learning">
          <div className="space-y-3">
            {courseProgress.length === 0 && (
              <p className="text-sm text-muted-foreground">No courses yet.</p>
            )}
            {courseProgress.map(({ course, progress }) => {
              const firstSubject = course.subjects[0];
              return (
                <div
                  key={course.id}
                  className="rounded-xl border bg-card/60 p-4"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate font-medium">{course.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {course.subjects.length} subjects
                      </div>
                    </div>
                    <Button asChild size="sm">
                      <Link to="/courses/$courseId" params={{ courseId: course.id }}>
                        Resume
                      </Link>
                    </Button>
                  </div>
                  <ProgressBar value={progress} />
                  <div className="mt-1 text-xs text-muted-foreground">
                    {progress}% complete · Next: {firstSubject?.title}
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel
          title={
            <span className="flex items-center gap-2">
              <Share2 className="h-4 w-4" /> Your Referral Link
            </span>
          }
        >
          <div className="flex gap-2">
            <input
              readOnly
              value={referralLink}
              className="flex-1 rounded-lg border bg-muted px-3 py-2 font-mono text-sm"
            />
            <Button
              variant="outline"
              onClick={() => navigator.clipboard?.writeText(referralLink)}
            >
              <Copy className="mr-1 h-4 w-4" /> Copy
            </Button>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <RefStat label="Direct" rate={referralRates.L1} value={stats.direct} />
            <RefStat label="Level 2" rate={referralRates.L2} value={stats.l2} />
            <RefStat label="Level 3" rate={referralRates.L3} value={stats.l3} />
          </div>
        </Panel>
      </div>
    </DashboardLayout>
  );
}

function RefStat({
  label,
  rate,
  value,
}: {
  label: string;
  rate: number;
  value: number;
}) {
  return (
    <div className="rounded-xl border bg-card/60 p-3">
      <div className="text-xs text-muted-foreground">
        {label} ({rate}%)
      </div>
      <div className="text-lg font-bold">₹{value}</div>
    </div>
  );
}
