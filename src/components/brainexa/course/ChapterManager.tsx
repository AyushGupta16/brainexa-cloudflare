import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, Trash2, Pencil, Calendar } from "lucide-react";
import { toast } from "sonner";
import {
  createChapter,
  updateChapter,
  deleteChapter,
  moveChapter,
  createTopic,
  updateTopic,
  deleteTopic,
  moveTopic,
} from "@/lib/coursesService";
import type { Subject, Chapter } from "@/lib/mockData";
import { ChapterDialog } from "./ChapterDialog";
import { TopicDialog } from "./TopicDialog";
import { ReorderButtons } from "./ReorderButtons";
import { ConfirmDelete } from "./ConfirmDelete";

const iconBtn = "h-7 w-7";

/** Chapter + topic CRUD for one subject. Shared by the admin and teacher dashboards. */
export function ChapterManager({ subject }: { subject: Subject }) {
  return (
    <div>
      <div className="flex justify-end mb-2">
        <ChapterDialog
          trigger={
            <Button size="sm" variant="outline">
              <Plus className="h-3 w-3 mr-1" /> Chapter
            </Button>
          }
          onSubmit={async (i) => {
            await createChapter(subject.id, i);
            toast.success("Chapter added");
          }}
        />
      </div>
      {subject.chapters.length === 0 ? (
        <p className="text-sm text-muted-foreground">No chapters yet.</p>
      ) : (
        <Accordion type="multiple">
          {subject.chapters.map((ch, chi) => (
            <AccordionItem key={ch.id} value={ch.id}>
              <div className="flex items-center justify-between gap-2">
                <AccordionTrigger className="flex-1">{ch.title}</AccordionTrigger>
                <div className="flex items-center gap-1 shrink-0">
                  <ReorderButtons
                    isFirst={chi === 0}
                    isLast={chi === subject.chapters.length - 1}
                    onMove={(d) => moveChapter(ch.id, d)}
                  />
                  <ChapterDialog
                    initial={ch}
                    trigger={
                      <Button size="icon" variant="ghost" className={iconBtn}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    }
                    onSubmit={async (i) => {
                      await updateChapter(ch.id, i);
                      toast.success("Chapter updated");
                    }}
                  />
                  <ConfirmDelete
                    trigger={
                      <Button size="icon" variant="ghost" className={iconBtn}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    }
                    description={`Delete chapter "${ch.title}" and its topics?`}
                    onConfirm={async () => {
                      await deleteChapter(ch.id);
                      toast.success("Chapter deleted");
                    }}
                  />
                </div>
              </div>
              <AccordionContent>
                <div className="flex justify-end mb-2">
                  <TopicDialog
                    trigger={
                      <Button size="sm" variant="outline">
                        <Plus className="h-3 w-3 mr-1" /> Topic
                      </Button>
                    }
                    onSubmit={async (i) => {
                      await createTopic(ch.id, i);
                      toast.success("Topic added");
                    }}
                  />
                </div>
                <TopicList chapter={ch} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}

function TopicList({ chapter }: { chapter: Chapter }) {
  if (chapter.topics.length === 0) {
    return <p className="text-sm text-muted-foreground">No topics yet.</p>;
  }
  return (
    <div className="space-y-2">
      {chapter.topics.map((t, ti) => (
        <div
          key={t.id}
          className="border rounded-md p-2 flex items-center justify-between gap-2"
        >
          <div className="text-sm min-w-0">
            <Link
              to="/topics/$topicId"
              params={{ topicId: t.id }}
              className="font-medium hover:text-primary"
            >
              {t.title}
            </Link>
            <div className="text-xs text-muted-foreground truncate">
              YouTube: {t.youtubeId}
              {t.unlockAt && (
                <span className="ml-2">
                  <Calendar className="inline h-3 w-3" /> {t.unlockAt}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <ReorderButtons
              isFirst={ti === 0}
              isLast={ti === chapter.topics.length - 1}
              onMove={(d) => moveTopic(t.id, d)}
            />
            <TopicDialog
              initial={t}
              trigger={
                <Button size="icon" variant="ghost" className={iconBtn}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              }
              onSubmit={async (i) => {
                await updateTopic(t.id, i);
                toast.success("Topic updated");
              }}
            />
            <ConfirmDelete
              trigger={
                <Button size="icon" variant="ghost" className={iconBtn}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              }
              description={`Delete topic "${t.title}"?`}
              onConfirm={async () => {
                await deleteTopic(t.id);
                toast.success("Topic deleted");
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
