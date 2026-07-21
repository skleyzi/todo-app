"use client";

import { cn } from "@/lib/utils";

export function priorityColor(priority: number) {
  if (priority >= 8) return "bg-destructive";
  if (priority >= 5) return "bg-accent";
  return "bg-muted-foreground/40";
}

export function priorityLabel(priority: number) {
  if (priority >= 8) return "High";
  if (priority >= 5) return "Medium";
  return "Low";
}

interface PrioritySelectProps {
  value: number;
  onChange: (value: number) => void;
}

export function PrioritySelect({ value, onChange }: PrioritySelectProps) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`Priority ${n}`}
          aria-pressed={value === n}
          onClick={() => onChange(n)}
          className={cn(
            "size-4 rounded-full border border-input transition-all cursor-pointer",
            "hover:scale-110",
            n <= value ? priorityColor(value) : "bg-transparent",
            n <= value && "border-transparent",
          )}
        />
      ))}
      <span className="ml-2 whitespace-nowrap text-sm text-muted-foreground tabular-nums">
        {value} · {priorityLabel(value)}
      </span>
    </div>
  );
}

export function PriorityDots({ priority }: { priority: number }) {
  return (
    <div className="flex items-center gap-1" title={`Priority ${priority} of 10`}>
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <span
            key={n}
            className={cn(
              "size-1.5 rounded-full",
              n <= priority ? priorityColor(priority) : "bg-border",
            )}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground tabular-nums ml-1">
        {priority}
      </span>
    </div>
  );
}
