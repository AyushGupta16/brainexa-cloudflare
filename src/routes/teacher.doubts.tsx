import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { DashboardLayout } from "@/components/brainexa/DashboardLayout";
import { doubts, getTopic, getTeacherSubjects } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/teacher/doubts")({
  component: TeacherDoubts,
});

const NAV = [
  { to: "/teacher", label: "Overview" },
  { to: "/teacher/subjects", label: "My Subjects" },
  { to: "/teacher/earnings", label: "Earnings" },
  { to: "/teacher/doubts", label: "Doubts" },
];

function TeacherDoubts() {
  const { user } = useAuth();
  const [tick, setTick] = useState(0);
  const [reply, setReply] = useState<Record<string, string>>({});
  if (!user) return <DashboardLayout title="Doubts" nav={NAV} requireRole="teacher"><></></DashboardLayout>;
  const subjIds = new Set(getTeacherSubjects(user.id).map((s) => s.subject.id));
  const myDoubts = doubts.filter((d) => {
    const t = getTopic(d.topicId);
    return t && subjIds.has(t.subject.id);
  });

  const send = (id: string) => {
    const text = reply[id]?.trim();
    if (!text) return;
    const d = doubts.find((x) => x.id === id);
    if (d) { d.reply = text; d.status = "answered"; }
    setReply({ ...reply, [id]: "" });
    setTick(tick + 1);
  };

  return (
    <DashboardLayout title="Doubts" nav={NAV} requireRole="teacher">
      <h1 className="text-2xl font-bold mb-4">Student Doubts</h1>
      <div className="space-y-3">
        {myDoubts.length === 0 && <p className="text-sm text-muted-foreground">No doubts in your subjects.</p>}
        {myDoubts.map((d) => {
          const t = getTopic(d.topicId);
          return (
            <Card key={d.id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {t && (
                      <Link to="/topics/$topicId" params={{ topicId: t.topic.id }} className="hover:text-primary">
                        {t.subject.title} → {t.chapter.title} → {t.topic.title}
                      </Link>
                    )}
                  </div>
                  <Badge variant={d.status === "answered" ? "default" : "secondary"}>{d.status}</Badge>
                </div>
                <div className="text-sm"><span className="font-medium">{d.studentName}: </span>{d.question}</div>
                {d.reply ? (
                  <div className="text-sm bg-muted/50 rounded p-2"><span className="font-medium text-primary">Reply: </span>{d.reply}</div>
                ) : (
                  <div className="flex gap-2">
                    <Textarea rows={2} placeholder="Reply..." value={reply[d.id] || ""} onChange={(e) => setReply({ ...reply, [d.id]: e.target.value })} />
                    <Button onClick={() => send(d.id)}>Reply</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
