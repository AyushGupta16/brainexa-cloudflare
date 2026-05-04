import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/brainexa/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin/withdrawals")({
  component: AdminWithdrawals,
});

const NAV = [
  { to: "/admin", label: "Overview" },
  { to: "/admin/courses", label: "Courses" },
  { to: "/admin/teachers", label: "Teachers" },
  { to: "/admin/referrals", label: "Referrals" },
  { to: "/admin/withdrawals", label: "Withdrawals" },
];

interface Withdrawal {
  id: string;
  requested_at: string;
  amount: number;
  upi_id: string;
  status: string;
  user_id: string;
  profiles?: { name: string } | null;
}

function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWithdrawals = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("withdrawals")
      .select("id, requested_at, amount, upi_id, status, user_id, profiles(name)")
      .order("requested_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch withdrawals:", error);
      alert("Failed to load withdrawals");
      setLoading(false);
      return;
    }

    setWithdrawals((data as Withdrawal[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("withdrawals")
      .update({
        status,
        processed_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Failed to update withdrawal:", error);
      alert("Failed to update withdrawal");
      return;
    }

    setWithdrawals((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status } : w))
    );
  };

  return (
    <DashboardLayout title="Withdrawals" nav={NAV} requireRole="admin">
      <h1 className="text-2xl font-bold mb-4">Withdrawal Requests</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>UPI</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {withdrawals.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground"
                    >
                      No requests yet.
                    </TableCell>
                  </TableRow>
                )}

                {withdrawals.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell>
                      {new Date(w.requested_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {w.profiles?.name ?? w.user_id.slice(0, 8)}
                    </TableCell>
                    <TableCell>₹{Number(w.amount).toFixed(2)}</TableCell>
                    <TableCell className="text-xs">{w.upi_id}</TableCell>
                    <TableCell>
                      <Badge
                        variant={w.status === "paid" ? "default" : "secondary"}
                      >
                        {w.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setStatus(w.id, "processing")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setStatus(w.id, "rejected")}
                      >
                        Reject
                      </Button>
                      <Button size="sm" onClick={() => setStatus(w.id, "paid")}>
                        Mark Paid
                      </Button>
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