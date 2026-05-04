import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/brainexa/DashboardLayout";
import {
  courses as initialCourses,
  type Course,
  type Subject,
  type Chapter,
  type Topic,
} from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, Trash2, Pencil, Calendar } from "lucide-react";

export const Route = createFileRoute("/admin/courses")({
  component: AdminCourses,
});

const NAV = [
  { to: "/admin", label: "Overview" },
  { to: "/admin/courses", label: "Courses" },
  { to: "/admin/teachers", label: "Teachers" },
  { to: "/admin/referrals", label: "Referrals" },
  { to: "/admin/withdrawals", label: "Withdrawals" },
];

const uid = () => Math.random().toString(36).slice(2, 9);

function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [, force] = useState(0);
  const refresh = () => { setCourses([...initialCourses]); force((x) => x + 1); };

  const addCourse = (title: string, price: number) => {
    const c: Course = { id: `c-${uid()}`, title, description: "", price, subjects: [] };
    initialCourses.push(c);
    refresh();
  };
  const deleteCourse = (id: string) => {
    const i = initialCourses.findIndex((c) => c.id === id);
    if (i >= 0) initialCourses.splice(i, 1);
    refresh();
  };
  const addSubject = (courseId: string, title: string) => {
    const c = initialCourses.find((x) => x.id === courseId)!;
    c.subjects.push({ id: `s-${uid()}`, courseId, title, chapters: [] });
    refresh();
  };
  const addChapter = (s: Subject, title: string) => {
    s.chapters.push({ id: `ch-${uid()}`, subjectId: s.id, title, topics: [] });
    refresh();
  };
  const addTopic = (ch: Chapter, t: Omit<Topic, "id" | "chapterId">) => {
    ch.topics.push({ ...t, id: `t-${uid()}`, chapterId: ch.id });
    refresh();
  };
  const deleteTopic = (ch: Chapter, id: string) => {
    const i = ch.topics.findIndex((t) => t.id === id);
    if (i >= 0) ch.topics.splice(i, 1);
    refresh();
  };

  return (
    <DashboardLayout title="Courses" nav={NAV} requireRole="admin">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Courses</h1>
        <NewCourseDialog onCreate={addCourse} />
      </div>

      <div className="space-y-4">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{course.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">₹{course.price}</Badge>
                  <NewSubjectDialog onCreate={(title) => addSubject(course.id, title)} />
                  <Button size="icon" variant="ghost" onClick={() => deleteCourse(course.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple">
                {course.subjects.map((s) => (
                  <AccordionItem key={s.id} value={s.id}>
                    <AccordionTrigger>
                      <span className="flex items-center gap-2">
                        {s.title}
                        <Badge variant="outline">{s.chapters.length} chapters</Badge>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex justify-end mb-2">
                        <NewChapterDialog onCreate={(t) => addChapter(s, t)} />
                      </div>
                      <Accordion type="multiple">
                        {s.chapters.map((ch) => (
                          <AccordionItem key={ch.id} value={ch.id}>
                            <AccordionTrigger>{ch.title}</AccordionTrigger>
                            <AccordionContent>
                              <div className="flex justify-end mb-2">
                                <NewTopicDialog onCreate={(t) => addTopic(ch, t)} />
                              </div>
                              <div className="space-y-2">
                                {ch.topics.map((t) => (
                                  <div key={t.id} className="border rounded-md p-2 flex items-center justify-between">
                                    <div className="text-sm">
                                      <Link to="/topics/$topicId" params={{ topicId: t.id }} className="font-medium hover:text-primary">
                                        {t.title}
                                      </Link>
                                      <div className="text-xs text-muted-foreground">
                                        YouTube: {t.youtubeId} {t.unlockAt && <span className="ml-2"><Calendar className="inline h-3 w-3" /> {t.unlockAt}</span>}
                                      </div>
                                    </div>
                                    <Button size="icon" variant="ghost" onClick={() => deleteTopic(ch, t.id)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}

function NewCourseDialog({ onCreate }: { onCreate: (t: string, p: number) => void }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("0");
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> New Course</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>New Course</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div><Label>Price (₹)</Label><Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} /></div>
        </div>
        <DialogFooter>
          <Button onClick={() => { if (title) { onCreate(title, parseInt(price) || 0); setTitle(""); setPrice("0"); setOpen(false); } }}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NewSubjectDialog({ onCreate }: { onCreate: (t: string) => void }) {
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm" variant="outline"><Plus className="h-3 w-3 mr-1" /> Subject</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>New Subject</DialogTitle></DialogHeader>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Subject name" />
        <DialogFooter><Button onClick={() => { if (title) { onCreate(title); setTitle(""); setOpen(false); } }}>Create</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NewChapterDialog({ onCreate }: { onCreate: (t: string) => void }) {
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm" variant="outline"><Plus className="h-3 w-3 mr-1" /> Chapter</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>New Chapter</DialogTitle></DialogHeader>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Chapter name" />
        <DialogFooter><Button onClick={() => { if (title) { onCreate(title); setTitle(""); setOpen(false); } }}>Create</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NewTopicDialog({ onCreate }: { onCreate: (t: Omit<Topic, "id" | "chapterId">) => void }) {
  const [title, setTitle] = useState("");
  const [yt, setYt] = useState("");
  const [pdf, setPdf] = useState("");
  const [unlock, setUnlock] = useState("");
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm" variant="outline"><Plus className="h-3 w-3 mr-1" /> Topic</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>New Topic</DialogTitle></DialogHeader>
        <div className="space-y-2">
          <div><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div><Label>YouTube Video ID</Label><Input value={yt} onChange={(e) => setYt(e.target.value)} placeholder="e.g. dQw4w9WgXcQ" /></div>
          <div><Label>PDF URL</Label><Input value={pdf} onChange={(e) => setPdf(e.target.value)} /></div>
          <div><Label>Unlock at (optional)</Label><Input type="datetime-local" value={unlock} onChange={(e) => setUnlock(e.target.value)} /></div>
        </div>
        <DialogFooter>
          <Button onClick={() => { if (title && yt) { onCreate({ title, youtubeId: yt, pdfUrl: pdf, unlockAt: unlock || undefined }); setTitle(""); setYt(""); setPdf(""); setUnlock(""); setOpen(false); } }}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
