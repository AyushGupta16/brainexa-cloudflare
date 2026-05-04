import { Check, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CourseCardProps {
  title: string;
  classLabel: string;
  tier: "free" | "premium";
  features: string[];
  ctaLabel: string;
  highlighted?: boolean;
}

export function CourseCard({
  title,
  classLabel,
  tier,
  features,
  ctaLabel,
  highlighted,
}: CourseCardProps) {
  const isPremium = tier === "premium";

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl bg-card p-6 ring-1 transition-all duration-300 hover:-translate-y-1",
        highlighted
          ? "ring-2 ring-gold shadow-gold"
          : "ring-border shadow-soft hover:shadow-elevated",
      )}
    >
      {highlighted && (
        <div className="absolute right-0 top-0 rounded-bl-xl bg-gradient-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-foreground">
          Best Seller
        </div>
      )}

      {/* Top accent banner */}
      <div
        className={cn(
          "mb-5 -mx-6 -mt-6 h-24 px-6 pt-5",
          isPremium ? "bg-gradient-navy" : "bg-gradient-to-br from-primary/10 to-emerald/10",
        )}
      >
        <span
          className={cn(
            "inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
            isPremium
              ? "bg-white/15 text-navy-foreground/90"
              : "bg-primary/15 text-primary",
          )}
        >
          {classLabel}
        </span>
        <p
          className={cn(
            "mt-1 text-lg font-bold leading-tight",
            isPremium ? "text-navy-foreground" : "text-foreground",
          )}
        >
          {title}
        </p>
      </div>

      <div className="mb-4 flex items-center gap-2">
        {isPremium ? (
          <>
            <span className="rounded-full bg-gold/15 px-2.5 py-1 text-xs font-bold text-gold-foreground ring-1 ring-gold/30">
              Premium
            </span>
            <span className="text-2xl font-extrabold text-foreground">₹299</span>
            <span className="rounded-full bg-emerald/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald ring-1 ring-emerald/30">
              Limited Offer
            </span>
          </>
        ) : (
          <span className="rounded-full bg-emerald/15 px-2.5 py-1 text-xs font-bold text-emerald ring-1 ring-emerald/30">
            Free
          </span>
        )}
      </div>

      <ul className="mb-6 space-y-2.5">
        {features.map((f) => (
          <li
            key={f}
            className="flex items-start gap-2 text-sm text-muted-foreground"
          >
            <Check
              className={cn(
                "mt-0.5 h-4 w-4 shrink-0",
                isPremium ? "text-gold" : "text-emerald",
              )}
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Button
        asChild
        size="lg"
        className={cn(
          "mt-auto w-full",
          isPremium
            ? "bg-gradient-gold text-gold-foreground hover:opacity-90"
            : "bg-foreground text-background hover:bg-foreground/90",
        )}
      >
        <Link to="/courses" search={isPremium ? { type: "premium" } : {}}>
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </article>
  );
}
