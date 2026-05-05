import brainexaLogo from "@/assets/brainexa-logo.webp";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

type LogoSize = "xsm" | "sm" | "md" | "lg" | "xl" | "2xl";

type LogoProps = {
  size?: LogoSize;
  className?: string;
  clickable?: boolean;
};

const sizeMap: Record<LogoSize, string> = {
  xsm: "h-8",
  sm: "h-12",
  md: "h-14",
  lg: "h-16",
  xl: "h-20",
  "2xl": "h-24",
};

export function Logo({ size = "md", className, clickable = true }: LogoProps) {
  const image = (
    <img
      src={brainexaLogo}
      alt="BRAINEXA"
      className={cn(
        "w-auto object-contain transition-transform hover:scale-105",
        sizeMap[size],
        className,
      )}
    />
  );

  if (!clickable) return image;

  return (
    <Link to="/" aria-label="BRAINEXA home">
      {image}
    </Link>
  );
}
