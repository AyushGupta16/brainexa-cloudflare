import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import type { TopicInput } from "@/lib/coursesService";
import type { Topic } from "@/lib/mockData";

interface Props {
  trigger: React.ReactNode;
  initial?: Topic;
  onSubmit: (input: TopicInput) => void | Promise<void>;
}

// datetime-local needs "YYYY-MM-DDTHH:mm"; tolerate already-trimmed ISO values.
const toLocalInput = (v?: string) => (v ? v.slice(0, 16) : "");

export function TopicDialog({ trigger, initial, onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [youtubeId, setYoutubeId] = useState(initial?.youtubeId ?? "");
  const [pdfUrl, setPdfUrl] = useState(initial?.pdfUrl ?? "");
  const [unlockAt, setUnlockAt] = useState(toLocalInput(initial?.unlockAt));
  const [description, setDescription] = useState(initial?.description ?? "");

  const reset = () => {
    setTitle(initial?.title ?? "");
    setYoutubeId(initial?.youtubeId ?? "");
    setPdfUrl(initial?.pdfUrl ?? "");
    setUnlockAt(toLocalInput(initial?.unlockAt));
    setDescription(initial?.description ?? "");
  };

  const submit = async () => {
    if (!title.trim() || !youtubeId.trim()) return;
    await onSubmit({
      title: title.trim(),
      youtubeId: youtubeId.trim(),
      pdfUrl: pdfUrl.trim() || undefined,
      unlockAt: unlockAt || undefined,
      description: description.trim() || undefined,
    });
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) reset();
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Topic" : "New Topic"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>YouTube Video ID</Label>
            <Input
              value={youtubeId}
              onChange={(e) => setYoutubeId(e.target.value)}
              placeholder="e.g. dQw4w9WgXcQ"
            />
          </div>
          <div>
            <Label>PDF URL</Label>
            <Input value={pdfUrl} onChange={(e) => setPdfUrl(e.target.value)} />
          </div>
          <div>
            <Label>Description (optional)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
          <div>
            <Label>Unlock at (optional)</Label>
            <Input
              type="datetime-local"
              value={unlockAt}
              onChange={(e) => setUnlockAt(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submit}>{initial ? "Save" : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
