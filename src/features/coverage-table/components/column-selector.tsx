"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { COVERAGE_COLUMNS } from "../types";

interface ColumnSelectorProps {
  hiddenColumns: string[];
  onToggle: (key: string, visible: boolean) => void;
  disabled?: boolean;
}

export function ColumnSelector({ hiddenColumns, onToggle, disabled }: ColumnSelectorProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {COVERAGE_COLUMNS.map((col) => {
        const visible = !hiddenColumns.includes(col.key);
        return (
          <label
            key={col.key}
            className={cn(
              "flex h-6 items-center gap-1.5 rounded-full border px-2 text-[11px] font-medium transition-colors select-none",
              visible
                ? "border-border bg-muted/40 text-foreground"
                : "border-dashed border-border/60 text-muted-foreground opacity-70",
              disabled ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-muted"
            )}
          >
            <Checkbox
              checked={visible}
              onCheckedChange={(c) => onToggle(col.key, c === true)}
              disabled={disabled}
              className="size-3"
            />
            {col.label}
          </label>
        );
      })}
    </div>
  );
}
