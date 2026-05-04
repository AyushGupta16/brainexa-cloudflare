import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/brainexa/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Wallet, TrendingUp, Share2, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const NAV = [
  { to: "/admin", label: "Overview" },
  { to: "/admin/courses", label: "Courses" },
  { to: "/admin/teachers", label: "Teachers" },
  { to: "/admin/referrals", label: "Referrals" },
  { to: "/admin/withdrawals", label: "Withdrawals" },
];

interface Stats {
  courseCount: number;
  studentCount: number;
  teacherCount: number;
  totalRevenue: number;
  totalCommissions: number;
  pendingWithdrawals: number;
  pendingDoubts: number;
}

function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    courseCount: 0,
    studentCount: 0,
    teacherCount: 0,
    totalRevenue: 0,
    totalCommissions: 0,
    pendingWithdrawals: 0,
    pendingDoubts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          { count: courseCount },
          { data: profiles },
          { data: enrollments },
          { data: commissions },
          { count: pendingWithdrawals },
          { count: pendingDoubts },
        ] = await Promise.all([
          supabase.from("courses").select("*", { count: "exact", head: true }),
          supabase.from("profiles").select("role"),
          supabase.from("enrollments").select("amount_paid"),
          supabase.from("commissions").select("amount"),
          supabase.from("withdrawals").select("*", { count: "exact", head: true }).eq("status", "requested"),
          supabase.from("doubts").select("*", { count: "exact", head: true }).eq("status", "pending"),
        ]);

        const studentCount = profiles?.filter((p) => p.role === "student").length ?? 0;
        const teacherCount = profiles?.filter((p) => p.role === "teacher").length ?? 0;
        const totalRevenue = enrollments?.reduce((a, e) => a + (e.amount_paid ?? 0), 0) ?? 0;
        const totalCommissions = commissions?.reduce((a, c) => a + Number(c.amount ?? 0), 0) ?? 0;

        setStats({
          courseCount: courseCount ?? 0,
          studentCount,
          teacherCount,
          totalRevenue,
          totalCommissions,
          pendingWithdrawals: pendingWithdrawals ?? 0,
          pendingDoubts: pendingDoubts ?? 0,
        });
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <DashboardLayout title="Admin" nav={NAV} requireRole="admin">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin Overview</h1>

        {loading ? (
          <div className="text-muted-foreground text-sm">Loading stats...</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat icon={<BookOpen className="h-5 w-5" />} label="Courses" value={stats.courseCount.toString()} />
            <Stat icon={<Users className="h-5 w-5" />} label="Students" value={stats.studentCount.toString()} />
            <Stat icon={<Users className="h-5 w-5" />} label="Teachers" value={stats.teacherCount.toString()} />
            <Stat icon={<TrendingUp className="h-5 w-5" />} label="Total Revenue" value={`₹${stats.totalRevenue}`} />
            <Stat icon={<Wallet className="h-5 w-5" />} label="Referral Commissions" value={`₹${stats.totalCommissions.toFixed(2)}`} />
            <Stat icon={<Share2 className="h-5 w-5" />} label="Pending Withdrawals" value={stats.pendingWithdrawals.toString()} />
            <Stat icon={<MessageCircle className="h-5 w-5" />} label="Pending Doubts" value={stats.pendingDoubts.toString()} />
          </div>
        )}

        <Card>
          <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild><Link to="/admin/courses">Manage Courses</Link></Button>
            <Button asChild variant="outline"><Link to="/admin/teachers">Teachers & Commissions</Link></Button>
            <Button asChild variant="outline"><Link to="/admin/referrals">Referrals</Link></Button>
            <Button asChild variant="outline"><Link to="/admin/withdrawals">Withdrawals</Link></Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 pt-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}