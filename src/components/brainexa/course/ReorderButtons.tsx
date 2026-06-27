import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";

interface Props {
  onMove: (dir: -1 | 1) => void | Promise<void>;
  isFirst: boolean;
  isLast: boolean;
}

export function ReorderButtons({ onMove, isFirst, isLast }: Props) {
  return (
    <div className="flex items-center">
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7"
        disabled={isFirst}
        onClick={() => onMove(-1)}
        aria-label="Move up"
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7"
        disabled={isLast}
        onClick={() => onMove(1)}
        aria-label="Move down"
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
}
