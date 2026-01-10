import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import Header from "@/components/Header";
import CategoryFilter from "@/components/catalogue/CategoryFilter";
import PartCard from "@/components/parts/PartCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/useScooterData";
import { useAllParts } from "@/hooks/useCatalogueData";
import { cn } from "@/lib/utils";

// Skeleton grid for loading state
const SkeletonGrid = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="bg-card rounded-xl p-4">
        <Skeleton className="aspect-square rounded-lg mb-3" />
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    ))}
  </div>
);

// Empty state component
const EmptyState = ({ onClear }: { onClear: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-20 text-center"
  >
    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
      <Search className="w-10 h-10 text-muted-foreground" />
    </div>
    <h3 className="font-display text-2xl text-foreground mb-2">
      AUCUNE PIÈCE TROUVÉE
    </h3>
    <p className="text-muted-foreground mb-6">
      Aucune pièce ne correspond à cette catégorie
    </p>
    <Button
      onClick={onClear}
      className="rounded-full px-6 bg-mineral text-white hover:bg-mineral-dark"
    >
      Effacer les filtres
    </Button>
  </motion.div>
);

const Catalogue = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: parts = [], isLoading: partsLoading } = useAllParts(activeCategory);

  // Handle scroll to add shadow on sticky filter
  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      setHasScrolled(scrollContainerRef.current.scrollTop > 10);
    }
  }, []);

  return (
    <div className="h-screen flex flex-col bg-greige">
      {/* Fixed Header */}
      <Header />

      {/* Main content area */}
      <main className="flex-1 flex flex-col pt-16 lg:pt-20 overflow-hidden">
        {/* Page Title */}
        <div className="container mx-auto px-4 py-6 lg:py-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-5xl md:text-6xl text-center text-foreground"
          >
            CATALOGUE
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-muted-foreground mt-2"
          >
            {partsLoading ? "Chargement..." : `${parts.length} pièces disponibles`}
          </motion.p>
        </div>

        {/* Sticky Category Filter with dynamic shadow */}
        <div
          className={cn(
            "sticky top-0 z-40 bg-greige/95 backdrop-blur-sm py-4 border-b border-border/30 transition-shadow duration-300",
            hasScrolled && "shadow-sm"
          )}
        >
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            isLoading={categoriesLoading}
          />
        </div>

        {/* Scrollable Product Grid */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto scrollbar-hide"
        >
          <div className="container mx-auto px-4 py-8">
            <AnimatePresence mode="wait">
              {partsLoading ? (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <SkeletonGrid />
                </motion.div>
              ) : parts.length > 0 ? (
                <motion.div
                  key={activeCategory || "all"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                >
                  {parts.map((part, index) => (
                    <PartCard key={part.id} part={part} index={index} />
                  ))}
                </motion.div>
              ) : (
                <EmptyState onClear={() => setActiveCategory(null)} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Catalogue;
