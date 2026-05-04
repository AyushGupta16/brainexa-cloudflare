import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { getTopic, getDoubtsForTopic, getTestsForRef, doubts as allDoubts, type Doubt } from "@/lib/mockData";
import { useAuth } from "@/lib/auth";
import { Navbar } from "@/components/brainexa/Navbar";
import { Footer } from "@/components/brainexa/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, ClipboardCheck, MessageCircle, Download } from "lucide-react";

export const Route = createFileRoute("/topics/$topicId")({
  component: TopicPage,
});

function TopicPage() {
  const { topicId } = Route.useParams();
  const data = getTopic(topicId);
  if (!data) throw notFound();
  const { course, subject, chapter, topic } = data;
  const topicTests = getTestsForRef("topic", topic.id);
  const { user } = useAuth();
  const [doubtList, setDoubtList] = useState<Doubt[]>(getDoubtsForTopic(topic.id));
  const [newDoubt, setNewDoubt] = useState("");
  const [replyMap, setReplyMap] = useState<Record<string, string>>({});

  const submitDoubt = () => {
    if (!newDoubt.trim() || !user) return;
    const d: Doubt = {
      id: `d-${Date.now()}`,
      topicId: topic.id,
      studentId: user.id,
      studentName: user.name,
      question: newDoubt,
      status: "pending",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    allDoubts.push(d);
    setDoubtList([...doubtList, d]);
    setNewDoubt("");
  };

  const submitReply = (id: string) => {
    const text = replyMap[id]?.trim();
    if (!text) return;
    const d = allDoubts.find((x) => x.id === id);
    if (d) {
      d.reply = text;
      d.status = "answered";
    }
    setDoubtList([...allDoubts.filter((x) => x.topicId === topic.id)]);
    setReplyMap({ ...replyMap, [id]: "" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <nav className="text-sm text-muted-foreground mb-4">
          <Link to="/courses" className="hover:text-primary">Courses</Link> /{" "}
          <Link to="/courses/$courseId" params={{ courseId: course.id }} className="hover:text-primary">
            {course.title}
          </Link>{" "}
          /{" "}
          <Link to="/subjects/$subjectId" params={{ subjectId: subject.id }} className="hover:text-primary">
            {subject.title}
          </Link>{" "}
          /{" "}
          <Link to="/chapters/$chapterId" params={{ chapterId: chapter.id }} className="hover:text-primary">
            {chapter.title}
          </Link>{" "}
          / <span className="text-foreground">{topic.title}</span>
        </nav>
        <h1 className="text-2xl md:text-3xl font-bold mb-6">{topic.title}</h1>

        <div className="grid lg:grid-cols-[1fr_340px] gap-6">
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="aspect-video bg-black">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${topic.youtubeId}`}
                  title={topic.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" /> Doubt Support ({doubtList.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user?.role === "student" && (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Ask your doubt about this topic..."
                      value={newDoubt}
                      onChange={(e) => setNewDoubt(e.target.value)}
                    />
                    <Button onClick={submitDoubt} size="sm">Post doubt</Button>
                  </div>
                )}
                {!user && (
                  <p className="text-sm text-muted-foreground">
                    <Link to="/login" className="text-primary underline">Sign in</Link> to ask doubts.
                  </p>
                )}
                <div className="space-y-3">
                  {doubtList.length === 0 && (
                    <p className="text-sm text-muted-foreground">No doubts yet. Be the first to ask!</p>
                  )}
                  {doubtList.map((d) => (
                    <div key={d.id} className="border rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-medium">{d.studentName}</div>
                        <Badge variant={d.status === "answered" ? "default" : "secondary"}>
                          {d.status}
                        </Badge>
                      </div>
                      <p className="text-sm mt-1">{d.question}</p>
                      {d.reply && (
                        <div className="mt-2 bg-muted/50 rounded p-2 text-sm">
                          <span className="font-medium text-primary">Teacher: </span>
                          {d.reply}
                        </div>
                      )}
                      {!d.reply && (user?.role === "teacher" || user?.role === "admin") && (
                        <div className="mt-2 flex gap-2">
                          <Textarea
                            rows={2}
                            placeholder="Reply..."
                            value={replyMap[d.id] || ""}
                            onChange={(e) => setReplyMap({ ...replyMap, [d.id]: e.target.value })}
                          />
                          <Button size="sm" onClick={() => submitReply(d.id)}>
                            Reply
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Study Material
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <a href={topic.pdfUrl} target="_blank" rel="noreferrer">
                    <Download className="h-4 w-4 mr-2" /> Download PDF Notes
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4" /> Topic Tests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {topicTests.length === 0 && (
                  <p className="text-sm text-muted-foreground">No test for this topic yet.</p>
                )}
                {topicTests.map((t) => (
                  <Button key={t.id} asChild variant="ghost" className="w-full justify-start">
                    <Link to="/tests/$testId" params={{ testId: t.id }}>
                      {t.title}
                    </Link>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
