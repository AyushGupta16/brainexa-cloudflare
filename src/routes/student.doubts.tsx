import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { DashboardLayout } from "@/components/brainexa/DashboardLayout";
import { doubts, getTopic } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/student/doubts")({
  component: StudentDoubts,
});

const NAV = [
  { to: "/student", label: "Overview" },
  { to: "/student/courses", label: "My Courses" },
  { to: "/student/referrals", label: "Referrals" },
  { to: "/student/doubts", label: "Doubts" },
];

function StudentDoubts() {
  const { user } = useAuth();
  const myDoubts = user ? doubts.filter((d) => d.studentId === user.id) : [];
  return (
    <DashboardLayout title="My Doubts" nav={NAV} requireRole="student">
      <h1 className="text-2xl font-bold mb-4">My Doubts</h1>
      <div className="space-y-3">
        {myDoubts.length === 0 && <p className="text-sm text-muted-foreground">No doubts yet.</p>}
        {myDoubts.map((d) => {
          const t = getTopic(d.topicId);
          return (
            <Card key={d.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    {t && (
                      <Link
                        to="/topics/$topicId"
                        params={{ topicId: t.topic.id }}
                        className="text-xs text-primary hover:underline"
                      >
                        {t.subject.title} → {t.chapter.title} → {t.topic.title}
                      </Link>
                    )}
                    <p className="text-sm mt-1 font-medium">{d.question}</p>
                    {d.reply && (
                      <p className="text-sm mt-2 bg-muted/50 rounded p-2">
                        <span className="font-medium text-primary">Teacher: </span>{d.reply}
                      </p>
                    )}
                  </div>
                  <Badge variant={d.status === "answered" ? "default" : "secondary"}>{d.status}</Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
