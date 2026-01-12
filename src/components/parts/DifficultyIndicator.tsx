import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Wrench } from "lucide-react";

interface DifficultyIndicatorProps {
  level: number | null;
  showLabel?: boolean;
  variant?: "dots" | "badge" | "compact";
  className?: string;
}

const difficultyConfig: Record<number, { label: string; colorClass: string; bgClass: string }> = {
  1: { label: "Très facile", colorClass: "text-[hsl(var(--difficulty-easy))]", bgClass: "bg-[hsl(var(--difficulty-easy))]" },
  2: { label: "Facile", colorClass: "text-[hsl(var(--difficulty-easy))]", bgClass: "bg-[hsl(var(--difficulty-easy))]" },
  3: { label: "Moyen", colorClass: "text-[hsl(var(--difficulty-medium))]", bgClass: "bg-[hsl(var(--difficulty-medium))]" },
  4: { label: "Difficile", colorClass: "text-[hsl(var(--difficulty-hard))]", bgClass: "bg-[hsl(var(--difficulty-hard))]" },
  5: { label: "Expert", colorClass: "text-[hsl(var(--difficulty-hard))]", bgClass: "bg-[hsl(var(--difficulty-hard))]" },
};

const DifficultyIndicator = forwardRef<HTMLDivElement, DifficultyIndicatorProps>(
  function DifficultyIndicatorInner({ level, showLabel = false, variant = "dots", className }, ref) {
    const safeLevel = Math.min(Math.max(level || 1, 1), 5);
    const config = difficultyConfig[safeLevel];

    // Badge variant - colored badge with icon
    if (variant === "badge") {
      return (
        <div
          ref={ref}
          className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5 rounded-full",
            config.bgClass,
            "bg-opacity-15",
            className
          )}
        >
          <Wrench className={cn("w-4 h-4", config.colorClass)} />
          <span className={cn("text-sm font-medium", config.colorClass)}>
            {config.label}
          </span>
        </div>
      );
    }

    // Compact variant - just icon and label
    if (variant === "compact") {
      return (
        <div ref={ref} className={cn("flex items-center gap-1.5", className)}>
          <div className={cn("w-2.5 h-2.5 rounded-full", config.bgClass)} />
          <span className={cn("text-xs font-medium", config.colorClass)}>
            {config.label}
          </span>
        </div>
      );
    }

    // Default dots variant - semantic colored dots
    return (
      <div ref={ref} className={cn("flex items-center gap-2", className)}>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((dot) => {
            // Determine color based on which "zone" this dot falls into
            let dotColor = "bg-carbon/20";
            if (dot <= safeLevel) {
              if (safeLevel <= 2) {
                dotColor = "bg-[hsl(var(--difficulty-easy))]";
              } else if (safeLevel === 3) {
                dotColor = "bg-[hsl(var(--difficulty-medium))]";
              } else {
                dotColor = "bg-[hsl(var(--difficulty-hard))]";
              }
            }

            return (
              <div
                key={dot}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  dotColor
                )}
              />
            );
          })}
        </div>
        {showLabel && (
          <span className={cn("text-xs font-medium", config.colorClass)}>
            {config.label}
          </span>
        )}
      </div>
    );
  }
);

export default DifficultyIndicator;
