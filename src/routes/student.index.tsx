import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { DashboardLayout } from "@/components/brainexa/DashboardLayout";
import {
  getStudentEnrollments,
  getStudentReferralStats,
  doubts,
  referralRates,
} from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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

function StudentDashboard() {
  const { user, profile } = useAuth();
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

  return (
    <DashboardLayout title="Student" nav={NAV} requireRole="student">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Welcome back, {profile.name}</h1>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<BookOpen className="h-5 w-5" />} label="Enrolled Courses" value={enrollments.length.toString()} />
          <StatCard icon={<MessageCircle className="h-5 w-5" />} label="My Doubts" value={myDoubts.length.toString()} />
          <StatCard icon={<Share2 className="h-5 w-5" />} label="Total Referrals" value={stats.totalReferrals.toString()} />
          <StatCard icon={<Wallet className="h-5 w-5" />} label="Referral Earnings" value={`₹${stats.total}`} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Continue Learning</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {enrollments.length === 0 && <p className="text-sm text-muted-foreground">No courses yet.</p>}
            {enrollments.map(({ course }) => {
              const firstSubject = course.subjects[0];
              const progress = Math.floor(Math.random() * 60) + 10;
              return (
                <div key={course.id} className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium">{course.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {course.subjects.length} subjects
                      </div>
                    </div>
                    <Button asChild size="sm">
                      <Link to="/courses/$courseId" params={{ courseId: course.id }}>Resume</Link>
                    </Button>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-1">
                    {progress}% complete · Next: {firstSubject?.title}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-4 w-4" /> Your Referral Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <input
                readOnly
                value={referralLink}
                className="flex-1 border rounded-md px-3 py-2 text-sm font-mono bg-muted"
              />
              <Button
                variant="outline"
                onClick={() => navigator.clipboard?.writeText(referralLink)}
              >
                <Copy className="h-4 w-4 mr-1" /> Copy
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4 text-center">
              <Stat label="Direct" rate={referralRates.L1} value={stats.direct} />
              <Stat label="Level 2" rate={referralRates.L2} value={stats.l2} />
              <Stat label="Level 3" rate={referralRates.L3} value={stats.l3} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Doubts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {myDoubts.length === 0 && <p className="text-sm text-muted-foreground">No doubts yet.</p>}
            {myDoubts.slice(0, 5).map((d) => (
              <div key={d.id} className="border rounded-md p-3 flex items-start justify-between">
                <p className="text-sm flex-1 pr-3">{d.question}</p>
                <Badge variant={d.status === "answered" ? "default" : "secondary"}>{d.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="bg-primary/10 text-primary p-2 rounded-md">{icon}</div>
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-xl font-bold">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, rate, value }: { label: string; rate: number; value: number }) {
  return (
    <div className="border rounded-md p-3">
      <div className="text-xs text-muted-foreground">{label} ({rate}%)</div>
      <div className="text-lg font-bold">₹{value}</div>
    </div>
  );
}
