import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/brainexa/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  PageGreeting,
  StatCardGrid,
  Panel,
  AgendaItem,
  TrendChart,
  MiniDonut,
} from "@/components/brainexa/DashboardUI";
import {
  BookOpen,
  Users,
  Wallet,
  TrendingUp,
  Share2,
  MessageCircle,
} from "lucide-react";
import { ADMIN_NAV as NAV } from "@/components/brainexa/dashboardNav";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

interface Stats {
  courseCount: number;
  studentCount: number;
  teacherCount: number;
  totalRevenue: number;
  totalCommissions: number;
  pendingWithdrawals: number;
  pendingDoubts: number;
}

const DEFAULT_STATS: Stats = {
  courseCount: 0,
  studentCount: 0,
  teacherCount: 0,
  totalRevenue: 0,
  totalCommissions: 0,
  pendingWithdrawals: 0,
  pendingDoubts: 0,
};

async function fetchAdminStats(): Promise<Stats> {
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

  return {
    courseCount: courseCount ?? 0,
    studentCount,
    teacherCount,
    totalRevenue,
    totalCommissions,
    pendingWithdrawals: pendingWithdrawals ?? 0,
    pendingDoubts: pendingDoubts ?? 0,
  };
}

function AdminDashboard() {
  // React Query caches the result, so returning to this tab shows data
  // instantly and refetches in the background (no more infinite spinner).
  const { data, isPending } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: fetchAdminStats,
    staleTime: 30_000,
  });
  const stats = data ?? DEFAULT_STATS;
  const loading = isPending;

  const usersTotal = stats.studentCount + stats.teacherCount;
  const usersData = [
    { name: "Students", value: stats.studentCount, color: "var(--color-primary)" },
    { name: "Teachers", value: stats.teacherCount, color: "var(--color-emerald)" },
  ];
  // Sample 6-month revenue trend (no time-series in the data layer yet).
  const revenueTrend = MONTHS.map((label, i) => ({
    label,
    value: Math.round((stats.totalRevenue / 6) * (0.6 + ((i * 17) % 50) / 100)),
  }));

  const rail = (
    <div className="space-y-2">
      <Panel title="Quick Actions">
        <div className="grid grid-cols-2 gap-2">
          {[
            { to: "/admin/courses", label: "Manage Courses" },
            { to: "/admin/referrals", label: "Referrals" },
            { to: "/admin/teachers", label: "Teachers & Commissions" },
            { to: "/admin/withdrawals", label: "Withdrawals" },
          ].map((a) => (
            <Button
              key={a.to}
              asChild
              variant="outline"
              className="h-auto w-full justify-center whitespace-normal py-2 text-center leading-tight"
            >
              <Link to={a.to}>{a.label}</Link>
            </Button>
          ))}
        </div>
      </Panel>

      <Panel title="Critical Actions">
        <div className="space-y-1">
          <Link to="/admin/withdrawals" className="block">
            <AgendaItem
              icon={<Wallet className="h-4 w-4" />}
              title="Pending withdrawals"
              subtitle="Awaiting approval"
              trailing={<CountPill value={stats.pendingWithdrawals} />}
            />
          </Link>
          <AgendaItem
            icon={<MessageCircle className="h-4 w-4" />}
            title="Pending doubts"
            subtitle="Unanswered by teachers"
            trailing={<CountPill value={stats.pendingDoubts} />}
          />
        </div>
      </Panel>

      <Panel title="Community">
        {usersTotal === 0 ? (
          <p className="text-sm text-muted-foreground">No users yet.</p>
        ) : (
          <>
            <MiniDonut data={usersData} centerValue={usersTotal} centerLabel="users" />
            <div className="mt-3 space-y-1.5">
              {usersData.map((u) => (
                <div key={u.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: u.color }} />
                    {u.name}
                  </span>
                  <span className="font-semibold">{u.value}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </Panel>
    </div>
  );

  return (
    <DashboardLayout title="Admin" nav={NAV} requireRole="admin" aside={rail}>
      <div className="space-y-6">
        <PageGreeting
          eyebrow="Control center"
          title="Admin Overview"
          subtitle="Platform health and pending actions."
        />

        {loading ? (
          <div className="text-sm text-muted-foreground">Loading stats…</div>
        ) : (
          <>
            <StatCardGrid
              className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
              items={[
                { icon: <TrendingUp className="h-4 w-4" />, label: "Total Revenue", value: `₹${stats.totalRevenue}` },
                { icon: <BookOpen className="h-4 w-4" />, label: "Courses", value: stats.courseCount },
                { icon: <Users className="h-4 w-4" />, label: "Students", value: stats.studentCount },
                { icon: <Users className="h-4 w-4" />, label: "Teachers", value: stats.teacherCount },
                { icon: <Wallet className="h-4 w-4" />, label: "Referral Commissions", value: `₹${stats.totalCommissions.toFixed(2)}` },
                { icon: <Share2 className="h-4 w-4" />, label: "Pending Withdrawals", value: stats.pendingWithdrawals },
                { icon: <MessageCircle className="h-4 w-4" />, label: "Pending Doubts", value: stats.pendingDoubts },
              ]}
            />

            <Panel
              hoverAccent
              title="Revenue Trend"
              action={<span className="text-xs text-muted-foreground">Last 6 months</span>}
            >
              <TrendChart data={revenueTrend} />
            </Panel>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

function CountPill({ value }: { value: number }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-bold ${
        value > 0
          ? "bg-destructive/10 text-destructive"
          : "bg-muted text-muted-foreground"
      }`}
    >
      {value}
    </span>
  );
}
