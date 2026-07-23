import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  children: ReactNode;
  className?: string;
}

// Thin wrapper that sets data-slot="button-group" — button.tsx's own
// variants already style sm/icon-sm sizes tighter when nested under that
// slot, so this just needs to apply it, not redefine spacing rules.
export function Toolbar({ children, className }: ToolbarProps) {
  return (
    <div
      data-slot="button-group"
      className={cn("inline-flex items-center gap-1 rounded-lg border border-border bg-muted/20 p-0.5", className)}
    >
      {children}
    </div>
  );
}
