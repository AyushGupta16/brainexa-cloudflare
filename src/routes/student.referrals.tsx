import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { DashboardLayout } from "@/components/brainexa/DashboardLayout";
import {
  getStudentReferralStats,
  referralCommissions,
  referrals,
  users,
  withdrawals,
  referralRates,
  type WithdrawalRequest,
} from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/student/referrals")({
  component: ReferralsPage,
});

const NAV = [
  { to: "/student", label: "Overview" },
  { to: "/student/courses", label: "My Courses" },
  { to: "/student/referrals", label: "Referrals" },
  { to: "/student/doubts", label: "Doubts" },
];

function ReferralsPage() {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [reqs, setReqs] = useState<WithdrawalRequest[]>(
    withdrawals.filter((w) => w.userId === user?.id),
  );
  if (!user) {
    return (
      <DashboardLayout title="Referrals" nav={NAV} requireRole="student">
        <></>
      </DashboardLayout>
    );
  }
  const stats = getStudentReferralStats(user.id);
  const myCommissions = referralCommissions.filter((r) => r.referrerId === user.id);
  const myReferrals = referrals
    .filter((r) => r.referrerId === user.id)
    .map((r) => ({ ...r, referee: users.find((u) => u.id === r.refereeId) }));

  const requestWithdrawal = () => {
    const amt = parseInt(amount);
    if (!amt || amt <= 0) return;
    const w: WithdrawalRequest = {
      id: `w-${Date.now()}`,
      userId: user.id,
      amount: amt,
      status: "pending",
      date: new Date().toISOString().slice(0, 10),
    };
    withdrawals.push(w);
    setReqs([...reqs, w]);
    setAmount("");
  };

  return (
    <DashboardLayout title="Referrals" nav={NAV} requireRole="student">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Referral Earnings</h1>

        <div className="grid gap-4 sm:grid-cols-4">
          <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Direct ({referralRates.L1}%)</div><div className="text-xl font-bold">₹{stats.direct}</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Level 2 ({referralRates.L2}%)</div><div className="text-xl font-bold">₹{stats.l2}</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Level 3 ({referralRates.L3}%)</div><div className="text-xl font-bold">₹{stats.l3}</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Total Earnings</div><div className="text-xl font-bold text-primary">₹{stats.total}</div></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Withdrawal</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Amount in ₹"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <Button onClick={requestWithdrawal}>Request Withdrawal</Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow><TableHead>Date</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {reqs.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell>{w.date}</TableCell>
                    <TableCell>₹{w.amount}</TableCell>
                    <TableCell><Badge variant="secondary">{w.status}</Badge></TableCell>
                  </TableRow>
                ))}
                {reqs.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">No requests yet.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Your Referrals</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow><TableHead>Name</TableHead><TableHead>Level</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {myReferrals.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell>{r.referee?.name ?? r.refereeId}</TableCell>
                    <TableCell><Badge>L{r.level}</Badge></TableCell>
                  </TableRow>
                ))}
                {myReferrals.length === 0 && <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground">No referrals yet.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Commission History</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow><TableHead>Level</TableHead><TableHead>%</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {myCommissions.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell><Badge>L{c.level}</Badge></TableCell>
                    <TableCell>{c.percent}%</TableCell>
                    <TableCell>₹{c.amount}</TableCell>
                    <TableCell><Badge variant={c.status === "paid" ? "default" : "secondary"}>{c.status}</Badge></TableCell>
                  </TableRow>
                ))}
                {myCommissions.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No commissions yet.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
