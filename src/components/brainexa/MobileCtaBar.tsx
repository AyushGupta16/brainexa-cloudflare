import { PlayCircle, ShoppingBag } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md shadow-elevated md:hidden">
      <div className="flex gap-2 p-3">
        <Button
          asChild
          size="lg"
          variant="outline"
          className="h-12 flex-1 border-2 border-foreground/15"
        >
          <Link to="/courses">
            <PlayCircle className="h-4 w-4" />
            Demo
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          className="h-12 flex-1 bg-gradient-gold text-gold-foreground hover:opacity-90 shadow-gold"
        >
          <Link to="/courses" search={{ type: "premium" }}>
            <ShoppingBag className="h-4 w-4" />
            Buy ₹299
          </Link>
        </Button>
      </div>
    </div>
  );
}
