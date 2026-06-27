import { useState } from "react";
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
import type { Subject } from "@/lib/mockData";

interface Props {
  trigger: React.ReactNode;
  initial?: Subject;
  onSubmit: (input: { title: string; icon?: string }) => void | Promise<void>;
}

export function SubjectDialog({ trigger, initial, onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [icon, setIcon] = useState(initial?.icon ?? "");

  const reset = () => {
    setTitle(initial?.title ?? "");
    setIcon(initial?.icon ?? "");
  };

  const submit = async () => {
    if (!title.trim()) return;
    await onSubmit({ title: title.trim(), icon: icon.trim() || undefined });
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Subject" : "New Subject"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Subject name"
            />
          </div>
          <div>
            <Label>Icon (optional)</Label>
            <Input value={icon} onChange={(e) => setIcon(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submit}>{initial ? "Save" : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
