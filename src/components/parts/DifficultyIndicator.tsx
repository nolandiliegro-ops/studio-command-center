import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface DifficultyIndicatorProps {
  level: number | null;
  showLabel?: boolean;
  className?: string;
}

const difficultyLabels: Record<number, string> = {
  1: "Très facile",
  2: "Facile",
  3: "Moyen",
  4: "Difficile",
  5: "Expert",
};

const DifficultyIndicator = forwardRef<HTMLDivElement, DifficultyIndicatorProps>(
  function DifficultyIndicatorInner({ level, showLabel = false, className }, ref) {
  const safeLevel = Math.min(Math.max(level || 1, 1), 5);

  return (
    <div ref={ref} className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((dot) => (
          <div
            key={dot}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              dot <= safeLevel
                ? "bg-mineral shadow-sm"
                : "bg-carbon/20"
            )}
          />
        ))}
      </div>
      {showLabel && (
        <span className="text-xs text-muted-foreground">
          {difficultyLabels[safeLevel]}
        </span>
      )}
    </div>
  );
  }
);

export default DifficultyIndicator;
