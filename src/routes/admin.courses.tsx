import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/brainexa/DashboardLayout";
import { ADMIN_NAV as NAV } from "@/components/brainexa/dashboardNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, Trash2, Pencil, LayoutGrid, GalleryHorizontalEnd } from "lucide-react";
import { toast } from "sonner";
import {
  useCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  moveCourse,
  createSubject,
  updateSubject,
  deleteSubject,
  moveSubject,
  getGroupDisplayMode,
  setGroupDisplayMode,
} from "@/lib/coursesService";
import type { Course } from "@/lib/mockData";
import { CourseDialog } from "@/components/brainexa/course/CourseDialog";
import { SubjectDialog } from "@/components/brainexa/course/SubjectDialog";
import { ReorderButtons } from "@/components/brainexa/course/ReorderButtons";
import { ConfirmDelete } from "@/components/brainexa/course/ConfirmDelete";
import { ChapterManager } from "@/components/brainexa/course/ChapterManager";

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

const iconBtn = "h-7 w-7";

function AdminCourses() {
  const courses = useCourses();
  const categories = Array.from(
    new Set(courses.map((c) => c.category).filter(Boolean)),
  ) as string[];

  return (
    <DashboardLayout title="Courses" nav={NAV} requireRole="admin">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Courses</h1>
        <CourseDialog
          trigger={
            <Button>
              <Plus className="h-4 w-4 mr-1" /> New Course
            </Button>
          }
          onSubmit={async (input) => {
            await createCourse(input);
            toast.success("Course created");
          }}
        />
      </div>

      {categories.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Public display mode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Choose how each group of courses appears on the public Courses page.
            </p>
            {categories.map((cat) => (
              <GroupModeRow key={cat} category={cat} />
            ))}
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {courses.map((course, ci) => (
          <Card
            key={course.id}
            style={{ borderLeftColor: course.color ?? "transparent" }}
            className="border-l-4"
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {course.thumbnail && (
                    <img
                      src={course.thumbnail}
                      alt=""
                      className="h-12 w-20 shrink-0 rounded object-cover border"
                    />
                  )}
                  <div className="min-w-0">
                    <CardTitle className="truncate">{course.title}</CardTitle>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <Badge variant="secondary">₹{course.price}</Badge>
                      {course.category && (
                        <Badge variant="outline">{course.category}</Badge>
                      )}
                      {course.isActive === false && (
                        <Badge variant="destructive">Inactive</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <ReorderButtons
                    isFirst={ci === 0}
                    isLast={ci === courses.length - 1}
                    onMove={(d) => moveCourse(course.id, d)}
                  />
                  <SubjectDialog
                    trigger={
                      <Button size="sm" variant="outline">
                        <Plus className="h-3 w-3 mr-1" /> Subject
                      </Button>
                    }
                    onSubmit={async (i) => {
                      await createSubject(course.id, i);
                      toast.success("Subject added");
                    }}
                  />
                  <CourseDialog
                    initial={course}
                    trigger={
                      <Button size="icon" variant="ghost" className={iconBtn}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    }
                    onSubmit={async (i) => {
                      await updateCourse(course.id, i);
                      toast.success("Course updated");
                    }}
                  />
                  <ConfirmDelete
                    trigger={
                      <Button size="icon" variant="ghost" className={iconBtn}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    }
                    description={`Delete "${course.title}" and all its subjects, chapters and topics? This cannot be undone.`}
                    onConfirm={async () => {
                      await deleteCourse(course.id);
                      toast.success("Course deleted");
                    }}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <SubjectList course={course} />
            </CardContent>
          </Card>
        ))}
        {courses.length === 0 && (
          <p className="text-sm text-muted-foreground">No courses yet.</p>
        )}
      </div>
    </DashboardLayout>
  );
}

function GroupModeRow({ category }: { category: string }) {
  const mode = getGroupDisplayMode(category);
  return (
    <div className="flex items-center justify-between border rounded-md p-2">
      <span className="text-sm font-medium">{category}</span>
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant={mode === "cards" ? "default" : "outline"}
          onClick={() => setGroupDisplayMode(category, "cards")}
        >
          <LayoutGrid className="h-4 w-4 mr-1" /> Cards
        </Button>
        <Button
          size="sm"
          variant={mode === "carousel" ? "default" : "outline"}
          onClick={() => setGroupDisplayMode(category, "carousel")}
        >
          <GalleryHorizontalEnd className="h-4 w-4 mr-1" /> Carousel
        </Button>
      </div>
    </div>
  );
}

function SubjectList({ course }: { course: Course }) {
  if (course.subjects.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No subjects yet.</p>
    );
  }
  return (
    <Accordion type="multiple">
      {course.subjects.map((s, si) => (
        <AccordionItem key={s.id} value={s.id}>
          <div className="flex items-center justify-between gap-2">
            <AccordionTrigger className="flex-1">
              <span className="flex items-center gap-2">
                {s.title}
                <Badge variant="outline">{s.chapters.length} chapters</Badge>
              </span>
            </AccordionTrigger>
            <div className="flex items-center gap-1 shrink-0">
              <ReorderButtons
                isFirst={si === 0}
                isLast={si === course.subjects.length - 1}
                onMove={(d) => moveSubject(s.id, d)}
              />
              <SubjectDialog
                initial={s}
                trigger={
                  <Button size="icon" variant="ghost" className={iconBtn}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                }
                onSubmit={async (i) => {
                  await updateSubject(s.id, i);
                  toast.success("Subject updated");
                }}
              />
              <ConfirmDelete
                trigger={
                  <Button size="icon" variant="ghost" className={iconBtn}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                }
                description={`Delete subject "${s.title}" and its chapters and topics?`}
                onConfirm={async () => {
                  await deleteSubject(s.id);
                  toast.success("Subject deleted");
                }}
              />
            </div>
          </div>
          <AccordionContent>
            <ChapterManager subject={s} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
