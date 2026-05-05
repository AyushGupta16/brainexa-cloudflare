import { BrainCircuit } from "lucide-react";

export function BrainCircuitLogo() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-soft">
      <BrainCircuit className="h-5 w-5 text-primary-foreground" />
    </span>
  );
}
