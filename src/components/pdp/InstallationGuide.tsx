import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Wrench, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import DifficultyIndicator from "@/components/parts/DifficultyIndicator";
import { cn } from "@/lib/utils";

interface InstallationGuideProps {
  difficultyLevel: number | null;
  estimatedTime: number | null;
  requiredTools: string[] | null;
}

const formatTime = (minutes: number | null): string => {
  if (!minutes) return "—";
  if (minutes < 60) return `~${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (remainingMins === 0) return `~${hours}h`;
  return `~${hours}h${remainingMins}`;
};

const getDifficultyLabel = (level: number): string => {
  switch (level) {
    case 1: return "Très facile";
    case 2: return "Facile";
    case 3: return "Moyen";
    case 4: return "Difficile";
    case 5: return "Expert";
    default: return "—";
  }
};

const getDifficultyColorClass = (level: number): string => {
  if (level <= 2) return "text-[hsl(var(--difficulty-easy))]";
  if (level === 3) return "text-[hsl(var(--difficulty-medium))]";
  return "text-[hsl(var(--difficulty-hard))]";
};

const getDifficultyBgClass = (level: number): string => {
  if (level <= 2) return "bg-[hsl(var(--difficulty-easy))]";
  if (level === 3) return "bg-[hsl(var(--difficulty-medium))]";
  return "bg-[hsl(var(--difficulty-hard))]";
};

const InstallationGuide = forwardRef<HTMLDivElement, InstallationGuideProps>(
  function InstallationGuideInner({ difficultyLevel, estimatedTime, requiredTools }, ref) {
    const safeLevel = Math.min(Math.max(difficultyLevel || 1, 1), 5);
    const tools = requiredTools?.filter(t => t && t.trim()) || [];

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="h-full bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl p-5 md:p-6 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/20">
          <Wrench className="w-5 h-5 text-mineral" />
          <h2 className="font-display text-lg uppercase tracking-wide text-carbon">
            Guide d'Installation
          </h2>
        </div>

        {/* Main Content Grid */}
        <div className="flex-1 grid grid-rows-[auto_auto_1fr] gap-4">
          {/* Difficulty Badge - Hero Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="flex items-center justify-between p-3 rounded-xl bg-white/50"
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                getDifficultyBgClass(safeLevel),
                "bg-opacity-15"
              )}>
                {safeLevel <= 2 ? (
                  <CheckCircle2 className={cn("w-5 h-5", getDifficultyColorClass(safeLevel))} />
                ) : (
                  <AlertTriangle className={cn("w-5 h-5", getDifficultyColorClass(safeLevel))} />
                )}
              </div>
              <div>
                <p className="text-xs text-carbon/60 font-medium uppercase tracking-wide">
                  Difficulté
                </p>
                <p className={cn("text-sm font-semibold", getDifficultyColorClass(safeLevel))}>
                  {getDifficultyLabel(safeLevel)}
                </p>
              </div>
            </div>
            <DifficultyIndicator level={safeLevel} variant="dots" />
          </motion.div>

          {/* Estimated Time */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/30"
          >
            <div className="w-10 h-10 rounded-full bg-mineral/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-mineral" />
            </div>
            <div>
              <p className="text-xs text-carbon/60 font-medium uppercase tracking-wide">
                Temps estimé
              </p>
              <p className="text-sm font-semibold text-carbon">
                {formatTime(estimatedTime)}
              </p>
            </div>
          </motion.div>

          {/* Required Tools */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="p-3 rounded-xl bg-white/30 overflow-hidden"
          >
            <p className="text-xs text-carbon/60 font-medium uppercase tracking-wide mb-2">
              Outils requis
            </p>
            {tools.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {tools.map((tool, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.5 + index * 0.05 }}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-carbon bg-white/50 rounded-md border border-white/30"
                  >
                    <Wrench className="w-3 h-3 text-mineral" />
                    {tool}
                  </motion.span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-carbon/50 italic">
                Aucun outil requis
              </p>
            )}
          </motion.div>
        </div>
      </motion.div>
    );
  }
);

export default InstallationGuide;
