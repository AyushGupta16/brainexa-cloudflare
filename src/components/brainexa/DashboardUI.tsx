import {
  type ReactNode,
  createContext,
  useContext,
  useId,
  useState,
} from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Hover group — coordinates ONE dark/active element (a stat card OR a */
/* panel/chart) across the whole center column. Following the mouse,   */
/* persisting on the last-hovered element when the cursor is idle.     */
/* ------------------------------------------------------------------ */

type HoverGroupValue = { active: string | null; setActive: (key: string) => void };
const HoverGroupContext = createContext<HoverGroupValue | null>(null);

export function HoverGroup({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <HoverGroupContext.Provider value={{ active, setActive }}>
      {children}
    </HoverGroupContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Greeting header (replaces the old heavy navy hero)                  */
/* ------------------------------------------------------------------ */

export function PageGreeting({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && (
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stat cards — soft light cards, with one optional gradient accent    */
/* ------------------------------------------------------------------ */

export function StatCard({
  icon,
  label,
  value,
  delta,
  progress,
  accent = false,
  neon = false,
  onMouseEnter,
  onMouseLeave,
}: {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
  delta?: string;
  /** 0–100; renders a soft progress bar under the value. */
  progress?: number;
  /** Highlight card with the soft brand gradient. */
  accent?: boolean;
  /** Adds a neon glow border (used on hover). */
  neon?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "min-w-0 rounded-2xl p-4 shadow-soft transition-all duration-300",
        accent
          ? "bg-gradient-dash text-gold ring-1 ring-white/10"
          : "border bg-card",
        neon &&
          "-translate-y-0.5 shadow-[0_0_0_1.5px_var(--color-primary-glow),0_10px_30px_-6px_var(--color-primary-glow)]",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {icon && (
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                accent ? "bg-gold/15 text-gold" : "bg-primary/10 text-primary",
              )}
            >
              {icon}
            </span>
          )}
          <span
            className={cn(
              "truncate text-xs font-medium uppercase tracking-wide",
              accent ? "text-gold/80" : "text-muted-foreground",
            )}
          >
            {label}
          </span>
        </div>
        {delta && (
          <span
            className={cn(
              "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold",
              accent ? "bg-white/10 text-gold" : "text-emerald",
            )}
          >
            {delta}
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-bold">{value}</p>
      {progress != null && (
        <ProgressBar
          value={progress}
          className="mt-3"
          trackClassName={accent ? "bg-white/15" : "bg-muted"}
          barClassName={accent ? "bg-gradient-gold" : "bg-gradient-accent"}
        />
      )}
    </div>
  );
}

export interface StatItem {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
  delta?: string;
  /** 0–100; renders a soft progress bar under the value. */
  progress?: number;
}

/**
 * Responsive row of stat cards where the dark/accent highlight follows the
 * mouse: the first card is accented by default, and hovering any card moves
 * the accent (plus a neon glow) to it while the first card reverts to light.
 */
export function StatCardGrid({
  items,
  className,
}: {
  items: StatItem[];
  /** Grid column classes, e.g. "grid-cols-2 lg:grid-cols-4". */
  className?: string;
}) {
  const group = useContext(HoverGroupContext);
  // `hovered` only drives the neon glow while a card is actually under the
  // cursor. The persistent dark card comes from the shared hover group so a
  // card and the chart are never both dark at once.
  const [hovered, setHovered] = useState<number | null>(null);
  const [localDark, setLocalDark] = useState(0); // fallback if no group
  const active = group?.active ?? null;
  const darkIdx =
    group == null
      ? localDark
      : active == null
        ? 0 // default: first card dark until something is hovered
        : active.startsWith("stat-")
          ? Number(active.slice(5))
          : -1; // a non-card (chart/panel) is active → no card is dark
  return (
    <div
      className={cn("grid gap-4", className)}
      onMouseLeave={() => setHovered(null)}
    >
      {items.map((item, i) => (
        <StatCard
          key={item.label}
          {...item}
          accent={darkIdx === i}
          neon={hovered === i}
          onMouseEnter={() => {
            setHovered(i);
            if (group) group.setActive(`stat-${i}`);
            else setLocalDark(i);
          }}
        />
      ))}
    </div>
  );
}

export function ProgressBar({
  value,
  className,
  trackClassName,
  barClassName,
}: {
  value: number;
  className?: string;
  trackClassName?: string;
  barClassName?: string;
}) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div
      className={cn(
        "h-1.5 overflow-hidden rounded-full bg-muted",
        trackClassName,
        className,
      )}
    >
      <div
        className={cn("h-full rounded-full bg-gradient-accent transition-all", barClassName)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Panel — soft section wrapper with optional header                   */
/* ------------------------------------------------------------------ */

export function Panel({
  title,
  action,
  children,
  className,
  bodyClassName,
  hoverAccent = false,
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  /** Strong navy panel + gold heading on hover; joins the center hover group. */
  hoverAccent?: boolean;
}) {
  const group = useContext(HoverGroupContext);
  const id = useId();
  // When in a hover group, stay dark while this panel is the active element
  // (persists when the cursor is idle); fall back to plain CSS :hover otherwise.
  const isActive = hoverAccent && group != null && group.active === id;
  return (
    <section
      onMouseEnter={
        hoverAccent && group ? () => group.setActive(id) : undefined
      }
      className={cn(
        "group min-w-0 rounded-2xl border bg-card shadow-soft transition-all duration-300",
        hoverAccent && "dash-hover",
        isActive && "dash-active",
        className,
      )}
    >
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 px-5 pt-5">
          {title && (
            <h2
              className={cn(
                "text-sm font-semibold tracking-tight",
                hoverAccent && "transition-colors group-hover:text-gold",
                isActive && "text-gold",
              )}
            >
              {title}
            </h2>
          )}
          {action}
        </header>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Agenda item — right-rail list row                                   */
/* ------------------------------------------------------------------ */

export function AgendaItem({
  icon,
  title,
  subtitle,
  trailing,
}: {
  icon?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border bg-card/60 px-3 py-2.5 transition-colors hover:bg-accent/40">
      {icon && (
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{title}</p>
        {subtitle && (
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Charts (recharts) — theme-aware via CSS variables                   */
/* ------------------------------------------------------------------ */

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid var(--color-border)",
  background: "var(--color-popover)",
  color: "var(--color-popover-foreground)",
  fontSize: 12,
  boxShadow: "var(--shadow-soft)",
};

export function TrendChart({
  data,
  xKey = "label",
  dataKey = "value",
  height = 220,
}: {
  data: Array<Record<string, string | number>>;
  xKey?: string;
  dataKey?: string;
  height?: number;
}) {
  const gid = useId().replace(/:/g, "");
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`fill-${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--color-border)"
          vertical={false}
        />
        <XAxis
          dataKey={xKey}
          tickLine={false}
          axisLine={false}
          fontSize={11}
          stroke="var(--color-muted-foreground)"
          tickMargin={8}
        />
        <YAxis hide />
        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "var(--color-border)" }} />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke="var(--color-primary)"
          strokeWidth={2.5}
          fill={`url(#fill-${gid})`}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function MiniDonut({
  data,
  height = 180,
  centerLabel,
  centerValue,
}: {
  data: Array<{ name: string; value: number; color: string }>;
  height?: number;
  centerLabel?: string;
  centerValue?: ReactNode;
}) {
  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="64%"
            outerRadius="92%"
            paddingAngle={3}
            cornerRadius={6}
            stroke="none"
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
      {(centerLabel || centerValue != null) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          {centerValue != null && (
            <span className="text-xl font-bold">{centerValue}</span>
          )}
          {centerLabel && (
            <span className="text-[11px] text-muted-foreground">{centerLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
