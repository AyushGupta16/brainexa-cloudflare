import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  inverted?: boolean;
  className?: string;
  logo?: ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  inverted = false,
  className,
  logo,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider",
            inverted ? "bg-gold/15 text-gold" : "bg-primary/10 text-primary",
          )}
        >
          {eyebrow}
        </span>
      )}

      <div
        className={cn(
          "mt-4 flex items-center gap-3",
          align === "center" ? "justify-center" : "justify-start",
        )}
      >
        {logo && <div className="shrink-0">{logo}</div>}

        <h2
          className={cn(
            "text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl",
            inverted ? "text-navy-foreground" : "text-foreground",
          )}
        >
          {title}
        </h2>
      </div>

      {subtitle && (
        <p
          className={cn(
            "mx-auto mt-4 max-w-2xl text-base leading-relaxed sm:text-lg",
            inverted ? "text-navy-foreground/75" : "text-muted-foreground",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
