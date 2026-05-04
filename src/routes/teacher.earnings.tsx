import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { DashboardLayout } from "@/components/brainexa/DashboardLayout";
import { getTeacherEarnings, getTeacherSubjects, enrollments } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/teacher/earnings")({
  component: TeacherEarnings,
});

const NAV = [
  { to: "/teacher", label: "Overview" },
  { to: "/teacher/subjects", label: "My Subjects" },
  { to: "/teacher/earnings", label: "Earnings" },
  { to: "/teacher/doubts", label: "Doubts" },
];

function TeacherEarnings() {
  const { user } = useAuth();
  if (!user) return <DashboardLayout title="Earnings" nav={NAV} requireRole="teacher"><></></DashboardLayout>;
  const e = getTeacherEarnings(user.id);
  const assigned = getTeacherSubjects(user.id);
  const courseMap = new Map(assigned.map((a) => [a.course.id, a]));
  const myEnrollments = enrollments.filter((en) => courseMap.has(en.courseId));

  return (
    <DashboardLayout title="Earnings" nav={NAV} requireRole="teacher">
      <h1 className="text-2xl font-bold mb-4">Earnings</h1>
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Total Sales</div><div className="text-xl font-bold">₹{e.totalSales}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">My Earnings</div><div className="text-xl font-bold text-primary">₹{e.totalEarning}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Paid</div><div className="text-xl font-bold text-emerald">₹{e.paid}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Pending</div><div className="text-xl font-bold text-gold">₹{e.pending}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Sales History</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Course</TableHead><TableHead>Amount</TableHead><TableHead>Commission %</TableHead><TableHead>Earning</TableHead></TableRow></TableHeader>
            <TableBody>
              {myEnrollments.map((en) => {
                const a = courseMap.get(en.courseId)!;
                return (
                  <TableRow key={en.id}>
                    <TableCell>{en.date}</TableCell>
                    <TableCell>{a.course.title}</TableCell>
                    <TableCell>₹{en.amount}</TableCell>
                    <TableCell>{a.commission}%</TableCell>
                    <TableCell>₹{Math.round((en.amount * a.commission) / 100)}</TableCell>
                  </TableRow>
                );
              })}
              {myEnrollments.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No sales yet.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
