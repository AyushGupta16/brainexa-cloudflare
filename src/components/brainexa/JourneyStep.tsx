import { type LucideIcon } from "lucide-react";

export interface JourneyStepProps {
  step: number;
  icon: LucideIcon;
  title: string;
  description: string;
  isLast?: boolean;
}

export function JourneyStep({
  step,
  icon: Icon,
  title,
  description,
  isLast,
}: JourneyStepProps) {
  return (
    <div className="relative flex gap-4 md:block md:flex-1">
      {/* Connector — vertical on mobile, horizontal on desktop */}
      {!isLast && (
        <>
          <span
            aria-hidden
            className="absolute left-6 top-12 h-[calc(100%-1rem)] w-0.5 bg-gradient-to-b from-primary/40 to-transparent md:hidden"
          />
          <span
            aria-hidden
            className="absolute left-[calc(50%+1.75rem)] top-6 hidden h-0.5 w-[calc(100%-3.5rem)] bg-gradient-to-r from-primary/40 to-primary/10 md:block"
          />
        </>
      )}

      <div className="relative z-10 flex md:flex-col md:items-center md:text-center">
        <div className="relative shrink-0">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-soft">
            <Icon className="h-5 w-5" />
          </span>
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-gold-foreground ring-2 ring-background">
            {step}
          </span>
        </div>
        <div className="ml-4 pb-8 md:ml-0 md:mt-4 md:pb-0">
          <h3 className="text-base font-bold text-foreground">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground md:mx-auto md:max-w-[14rem]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
