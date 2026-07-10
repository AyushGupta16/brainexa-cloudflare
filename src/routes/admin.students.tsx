import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/brainexa/DashboardLayout";
import { ADMIN_NAV as NAV } from "@/components/brainexa/dashboardNav";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin/students")({
  component: AdminStudents,
});

interface StudentRow {
  id: string;
  name: string;
  courses: string[];
  commissionTotal: number;
}

async function fetchStudents(): Promise<StudentRow[]> {
  const [{ data: profiles }, { data: enrollments }, { data: commissions }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, name")
        .eq("role", "student")
        .order("created_at", { ascending: false }),

      supabase
        .from("enrollments")
        .select("student_id, course:courses(id, title)"),

      supabase.from("commissions").select("beneficiary_id, amount"),
    ]);

  // Enrolled course titles per student
  const coursesByStudent: Record<string, string[]> = {};
  ((enrollments as
    | { student_id: string | null; course: { title: string } | null }[]
    | null) ?? []
  ).forEach((e) => {
    if (!e.student_id || !e.course?.title) return;
    (coursesByStudent[e.student_id] ??= []).push(e.course.title);
  });

  // Referral commission total per student (as beneficiary)
  const commissionByStudent: Record<string, number> = {};
  ((commissions as { beneficiary_id: string; amount: number }[] | null) ?? []).forEach(
    (c) => {
      commissionByStudent[c.beneficiary_id] =
        (commissionByStudent[c.beneficiary_id] ?? 0) + (Number(c.amount) || 0);
    },
  );

  return ((profiles as { id: string; name: string }[] | null) ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    courses: coursesByStudent[s.id] ?? [],
    commissionTotal: commissionByStudent[s.id] ?? 0,
  }));
}

function AdminStudents() {
  const { data, isPending } = useQuery({
    queryKey: ["admin-students"],
    queryFn: fetchStudents,
    staleTime: 30_000,
  });
  const students = data ?? [];

  return (
    <DashboardLayout title="Students" nav={NAV} requireRole="admin">
      <h1 className="mb-1 text-2xl font-bold">Students</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        Enrolled courses and total referral commissions earned per student.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>
            All Students{" "}
            <span className="text-muted-foreground">({students.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : students.length === 0 ? (
            <p className="text-sm text-muted-foreground">No students found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Enrolled Courses</TableHead>
                  <TableHead className="text-right">Referral Commissions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>
                      {s.courses.length === 0 ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {s.courses.map((c, i) => (
                            <Badge key={`${c}-${i}`} variant="secondary">
                              {c}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ₹{s.commissionTotal.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
