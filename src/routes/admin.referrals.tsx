import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/brainexa/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin/referrals")({
  component: AdminReferrals,
});

const NAV = [
  { to: "/admin", label: "Overview" },
  { to: "/admin/courses", label: "Courses" },
  { to: "/admin/teachers", label: "Teachers" },
  { to: "/admin/referrals", label: "Referrals" },
  { to: "/admin/withdrawals", label: "Withdrawals" },
];

type RateKey = "L1" | "L2" | "L3";

interface ReferralRates {
  L1: number;
  L2: number;
  L3: number;
}

interface ReferralRow {
  id: string;
  name: string;
  referral_code: string;
  referred_by: string | null;
}

interface CommissionRow {
  id: string;
  level: number;
  percentage: number;
  amount: number;
  status: string;
  beneficiary_id: string;
  created_at: string;
  beneficiary?: { name: string } | null;
}

function AdminReferrals() {
  const [rates, setRates] = useState<ReferralRates>({
    L1: 7,
    L2: 3,
    L3: 2.5,
  });

  const [referrals, setReferrals] = useState<ReferralRow[]>([]);
  const [commissions, setCommissions] = useState<CommissionRow[]>([]);
  const [usersById, setUsersById] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const userName = (id: string | null | undefined) => {
    if (!id) return "—";
    return usersById[id] ?? id.slice(0, 8);
  };

  useEffect(() => {
    async function load() {
      setLoading(true);

      const [ratesRes, profilesRes, commsRes] = await Promise.all([
        supabase
          .from("commission_rates")
          .select("level, percentage")
          .order("level", { ascending: true }),

        supabase
          .from("profiles")
          .select("id, name, referral_code, referred_by"),

        supabase
          .from("commissions")
          .select(
            "id, level, percentage, amount, status, beneficiary_id, created_at, beneficiary:profiles!commissions_beneficiary_id_fkey(name)"
          )
          .order("created_at", { ascending: false }),
      ]);

      if (ratesRes.data) {
        const nextRates: ReferralRates = { L1: 7, L2: 3, L3: 2.5 };

        ratesRes.data.forEach((r) => {
          if (r.level === 1) nextRates.L1 = Number(r.percentage);
          if (r.level === 2) nextRates.L2 = Number(r.percentage);
          if (r.level === 3) nextRates.L3 = Number(r.percentage);
        });

        setRates(nextRates);
      }

      const profiles = (profilesRes.data ?? []) as ReferralRow[];

      setReferrals(profiles.filter((p) => p.referred_by));

      setUsersById(
        profiles.reduce<Record<string, string>>((acc, p) => {
          acc[p.id] = p.name;
          return acc;
        }, {})
      );

      setCommissions((commsRes.data as CommissionRow[]) ?? []);
      setLoading(false);
    }

    load();
  }, []);

  const saveRate = async (rateKey: RateKey, value: number) => {
    const level = rateKey === "L1" ? 1 : rateKey === "L2" ? 2 : 3;

    const { error } = await supabase.from("commission_rates").upsert({
      level,
      percentage: value,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Failed to save commission rate:", error);
      alert("Failed to save commission rate");
      return;
    }

    alert(`${rateKey} commission updated to ${value}%`);
  };

  const togglePaid = async (id: string) => {
    const commission = commissions.find((x) => x.id === id);
    if (!commission) return;

    const nextStatus = commission.status === "paid" ? "pending" : "paid";

    const { error } = await supabase
      .from("commissions")
      .update({ status: nextStatus })
      .eq("id", id);

    if (error) {
      console.error("Failed to update commission:", error);
      alert("Failed to update commission");
      return;
    }

    setCommissions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: nextStatus } : c))
    );
  };

  return (
    <DashboardLayout title="Referrals" nav={NAV} requireRole="admin">
      <h1 className="text-2xl font-bold mb-4">Referral Management</h1>

      <Card className="mb-6">
        <CardHeader><CardTitle>Commission Rates</CardTitle></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <Rate label="Direct (L1)" rateKey="L1" value={rates.L1} setRates={setRates} onSave={saveRate} />
          <Rate label="Level 2" rateKey="L2" value={rates.L2} setRates={setRates} onSave={saveRate} />
          <Rate label="Level 3" rateKey="L3" value={rates.L3} setRates={setRates} onSave={saveRate} />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader><CardTitle>Referral Network</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : referrals.length === 0 ? (
            <p className="text-sm text-muted-foreground">No referrals yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Referrer</TableHead>
                  <TableHead>Referee</TableHead>
                  <TableHead>Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{userName(r.referred_by)}</TableCell>
                    <TableCell>{r.name}</TableCell>
                    <TableCell><Badge>L1</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Commissions</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : commissions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No commissions yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Referrer</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>%</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commissions.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.beneficiary?.name ?? userName(c.beneficiary_id)}</TableCell>
                    <TableCell><Badge>L{c.level}</Badge></TableCell>
                    <TableCell>{Number(c.percentage)}%</TableCell>
                    <TableCell>₹{Number(c.amount).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={c.status === "paid" ? "default" : "secondary"}>
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => togglePaid(c.id)}>
                        Toggle
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

function Rate({
  label,
  rateKey,
  value,
  setRates,
  onSave,
}: {
  label: string;
  rateKey: RateKey;
  value: number;
  setRates: React.Dispatch<React.SetStateAction<ReferralRates>>;
  onSave: (rateKey: RateKey, value: number) => Promise<void>;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex gap-2 items-center">
        <Input
          type="number"
          value={value}
          onChange={(e) =>
            setRates((prev) => ({
              ...prev,
              [rateKey]: parseFloat(e.target.value) || 0,
            }))
          }
        />
        <Button size="sm" onClick={() => onSave(rateKey, value)}>
          Save
        </Button>
      </div>
    </div>
  );
}