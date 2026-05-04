import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/brainexa/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin/teachers")({
  component: AdminTeachers,
});

const NAV = [
  { to: "/admin", label: "Overview" },
  { to: "/admin/courses", label: "Courses" },
  { to: "/admin/teachers", label: "Teachers" },
  { to: "/admin/referrals", label: "Referrals" },
  { to: "/admin/withdrawals", label: "Withdrawals" },
];

interface Teacher {
  id: string;
  name: string;
}

interface Assignment {
  id: string;
  teacher_id: string;
  subject_id: string;
  commission_percent: number;
  subject?: {
    id: string;
    title: string;
    course_id: string;
    course?: {
      id: string;
      title: string;
    } | null;
  } | null;
}

interface Earning {
  teacher_id: string;
  total_sales: number;
  total_earning: number;
  paid: number;
  pending: number;
}

function AdminTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [earnings, setEarnings] = useState<Record<string, Earning>>({});
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);

    const [{ data: teacherData }, { data: assignmentData }, { data: commissionData }] =
      await Promise.all([
        supabase
          .from("profiles")
          .select("id, name")
          .eq("role", "teacher")
          .order("created_at", { ascending: false }),

        (supabase as any)
          .from("teacher_assignments")
          .select(`
            id,
            teacher_id,
            subject_id,
            commission_percent,
            subject:subjects(
              id,
              title,
              course_id,
              course:courses(id, title)
            )
          `),

        supabase
          .from("commissions")
          .select("beneficiary_id, amount, status"),
      ]);

    setTeachers((teacherData as Teacher[]) ?? []);
    setAssignments((assignmentData as Assignment[]) ?? []);

    const calculated: Record<string, Earning> = {};

    ((commissionData as any[]) ?? []).forEach((c) => {
      const teacherId = c.beneficiary_id;
      const amount = Number(c.amount) || 0;

      if (!calculated[teacherId]) {
        calculated[teacherId] = {
          teacher_id: teacherId,
          total_sales: 0,
          total_earning: 0,
          paid: 0,
          pending: 0,
        };
      }

      calculated[teacherId].total_earning += amount;

      if (c.status === "paid") {
        calculated[teacherId].paid += amount;
      } else {
        calculated[teacherId].pending += amount;
      }
    });

    setEarnings(calculated);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateCommission = async (
    teacherId: string,
    subjectId: string,
    val: number
  ) => {
    const existing = assignments.find(
      (x) => x.teacher_id === teacherId && x.subject_id === subjectId
    );

    if (!existing) return;

    const { error } = await (supabase as any)
      .from("teacher_assignments")
      .update({ commission_percent: val })
      .eq("id", existing.id);

    if (error) {
      console.error("Failed to update teacher commission:", error);
      alert("Failed to update commission");
      return;
    }

    setAssignments((prev) =>
      prev.map((a) =>
        a.id === existing.id ? { ...a, commission_percent: val } : a
      )
    );
  };

  return (
    <DashboardLayout title="Teachers" nav={NAV} requireRole="admin">
      <h1 className="text-2xl font-bold mb-4">Teachers & Commissions</h1>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : teachers.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            No teachers found.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {teachers.map((t) => {
            const e = earnings[t.id] ?? {
              total_sales: 0,
              total_earning: 0,
              paid: 0,
              pending: 0,
            };

            const assigns = assignments.filter((a) => a.teacher_id === t.id);

            return (
              <Card key={t.id}>
                <CardHeader>
                  <CardTitle>{t.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">Teacher ID: {t.id.slice(0, 8)}</p>                </CardHeader>

                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-4 mb-4">
                    <Stat label="Sales" value={`₹${e.total_sales}`} />
                    <Stat label="Earnings" value={`₹${e.total_earning}`} />
                    <Stat label="Paid" value={`₹${e.paid}`} />
                    <Stat label="Pending" value={`₹${e.pending}`} />
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Commission %</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {assigns.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-center text-muted-foreground"
                          >
                            No subjects assigned yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        assigns.map((a) => (
                          <TableRow key={a.id}>
                            <TableCell>
                              {a.subject?.course?.title ?? "—"}
                            </TableCell>
                            <TableCell>{a.subject?.title ?? "—"}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                className="w-24"
                                defaultValue={a.commission_percent}
                                onBlur={(e) =>
                                  updateCommission(
                                    t.id,
                                    a.subject_id,
                                    parseInt(e.target.value) || 0
                                  )
                                }
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border rounded-md p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-bold">{value}</div>
    </div>
  );
}