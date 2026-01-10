import { motion } from "framer-motion";
import { 
  LayoutGrid, 
  Disc, 
  CircleDot, 
  Octagon, 
  Plug, 
  Battery, 
  Backpack,
  LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  id: string;
  name: string;
  icon: string | null;
  slug: string;
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  isLoading?: boolean;
}

// Mapping slug -> Lucide icon
const iconMap: Record<string, LucideIcon> = {
  pneus: Disc,
  "chambres-a-air": CircleDot,
  freinage: Octagon,
  chargeurs: Plug,
  batteries: Battery,
  accessoires: Backpack,
};

const CategoryFilter = ({
  categories,
  activeCategory,
  onCategoryChange,
  isLoading = false,
}: CategoryFilterProps) => {
  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide py-1">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-28 rounded-full flex-shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex gap-3 overflow-x-auto scrollbar-hide py-1">
        {/* "Toutes" button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategoryChange(null)}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all flex-shrink-0",
            activeCategory === null
              ? "bg-mineral text-white shadow-md"
              : "bg-white/20 backdrop-blur-sm border border-white/30 text-foreground hover:bg-white/30"
          )}
        >
          <LayoutGrid className="w-4 h-4" />
          Toutes
        </motion.button>

        {/* Category buttons */}
        {categories.map((category) => {
          const IconComponent = iconMap[category.slug] || LayoutGrid;
          const isActive = activeCategory === category.id;

          return (
            <motion.button
              key={category.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all flex-shrink-0",
                isActive
                  ? "bg-mineral text-white shadow-md"
                  : "bg-white/20 backdrop-blur-sm border border-white/30 text-foreground hover:bg-white/30"
              )}
            >
              <IconComponent className="w-4 h-4" />
              {category.name}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;
