import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import type { CourseInput } from "@/lib/coursesService";
import type { Course } from "@/lib/mockData";

interface Props {
  trigger: React.ReactNode;
  initial?: Course;
  onSubmit: (input: CourseInput) => void | Promise<void>;
}

export function CourseDialog({ trigger, initial, onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(String(initial?.price ?? 0));
  const [category, setCategory] = useState(initial?.category ?? "");
  const [color, setColor] = useState(initial?.color ?? "#6366f1");
  const [thumbnail, setThumbnail] = useState(initial?.thumbnail ?? "");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);

  const reset = () => {
    setTitle(initial?.title ?? "");
    setDescription(initial?.description ?? "");
    setPrice(String(initial?.price ?? 0));
    setCategory(initial?.category ?? "");
    setColor(initial?.color ?? "#6366f1");
    setThumbnail(initial?.thumbnail ?? "");
    setIsActive(initial?.isActive ?? true);
  };

  const submit = async () => {
    if (!title.trim()) return;
    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      price: parseInt(price) || 0,
      category: category.trim() || undefined,
      color,
      thumbnail: thumbnail.trim() || undefined,
      isActive,
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
          <DialogTitle>{initial ? "Edit Course" : "New Course"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Price (₹)</Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <Label>Category / Group</Label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Class 10"
              />
            </div>
          </div>
          <div>
            <Label>Accent Colour</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-9 w-12 rounded border bg-background p-1"
                aria-label="Pick accent colour"
              />
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#6366f1"
              />
            </div>
          </div>
          <div>
            <Label>Thumbnail URL</Label>
            <Input
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="https://…"
            />
            {thumbnail && (
              <img
                src={thumbnail}
                alt="Thumbnail preview"
                className="mt-2 h-28 w-full rounded-md border object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
                onLoad={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "block";
                }}
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={isActive} onCheckedChange={setIsActive} id="course-active" />
            <Label htmlFor="course-active">Active (visible to students)</Label>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submit}>{initial ? "Save" : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
