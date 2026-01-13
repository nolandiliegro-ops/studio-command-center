import { useState, useRef, useEffect } from "react";
import { Search, Sparkles, Star, Home, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brand, ScooterModel } from "@/data/scooterData";
import { useSearchScooters } from "@/hooks/useScooterData";
import SearchDropdown from "./SearchDropdown";
import { motion } from "framer-motion";
import AnimatedNumber from "@/components/ui/animated-number";

interface CommandPanelProps {
  brands: Brand[];
  selectedBrand: string | null;
  onBrandSelect: (brandId: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onModelSelect?: (modelSlug: string) => void;
  activeModel?: ScooterModel | null;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
  totalModels?: number;
  currentIndex?: number;
}

const CommandPanel = ({
  brands,
  selectedBrand,
  onBrandSelect,
  searchQuery,
  onSearchChange,
  onModelSelect,
  activeModel,
  onNavigatePrev,
  onNavigateNext,
  totalModels = 0,
  currentIndex = 0,
}: CommandPanelProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  const { data: searchResults = [], isLoading } = useSearchScooters(searchQuery);

  // Show dropdown when query is long enough and we have focus
  useEffect(() => {
    setShowDropdown(searchQuery.length >= 2);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleModelSelect = (slug: string) => {
    setShowDropdown(false);
    onSearchChange("");
    onModelSelect?.(slug);
  };

  return (
    <div className="flex flex-col justify-start h-full space-y-4">
      {/* FIRST: Active Model Info - Priority placement */}
      {activeModel && (
        <motion.div 
          key={activeModel.id}
          className="animate-fade-in"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Brand Badge */}
          <motion.div
            className="inline-block px-3 py-1 rounded-full bg-white/80 border border-mineral/20 backdrop-blur-sm mb-2"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
              {activeModel.brand}
            </p>
          </motion.div>

          {/* Model Name */}
          <motion.h3 
            className="font-display text-2xl lg:text-3xl text-carbon mb-2 tracking-wide leading-tight"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            {activeModel.name}
          </motion.h3>

          {/* Compatible Parts Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-mineral/15 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-muted-foreground text-sm">Pièces compatibles:</span>
            <AnimatedNumber 
              value={activeModel.compatibleParts} 
              className="text-mineral font-bold text-lg"
            />
          </motion.div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3 mt-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={onNavigatePrev}
                className="rounded-full w-9 h-9 bg-white/80 border-mineral/20 hover:border-mineral/40 hover:bg-white backdrop-blur-sm transition-all"
              >
                <ChevronLeft className="w-4 h-4 text-carbon" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={onNavigateNext}
                className="rounded-full w-9 h-9 bg-white/80 border-mineral/20 hover:border-mineral/40 hover:bg-white backdrop-blur-sm transition-all"
              >
                <ChevronRight className="w-4 h-4 text-carbon" />
              </Button>
            </motion.div>

            {/* Counter */}
            <span className="text-sm text-muted-foreground ml-2">
              {currentIndex + 1} / {totalModels}
            </span>
          </div>
        </motion.div>
      )}

      {/* Separator */}
      <div className="border-t border-mineral/10" />

      {/* Section Title */}
      <div className="animate-fade-in">
        <p className="text-xs tracking-[0.2em] text-muted-foreground font-medium mb-1">
          RECHERCHER
        </p>
        <h2 className="font-display text-lg lg:text-xl text-foreground">
          Identifiez votre trottinette
        </h2>
      </div>

      {/* Search Bar with Dropdown */}
      <div 
        ref={searchContainerRef}
        className="relative animate-fade-in" 
        style={{ animationDelay: "0.1s" }}
      >
        <div className="glass rounded-2xl p-1">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Modèle, marque..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowDropdown(true)}
              className="pl-12 pr-4 py-4 text-base bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
            />
          </div>
        </div>
        
        {/* Predictive Search Dropdown */}
        <SearchDropdown
          results={searchResults}
          isVisible={showDropdown}
          isLoading={isLoading}
          onSelect={handleModelSelect}
        />
      </div>

      {/* Brand Selection */}
      <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <p className="text-xs text-muted-foreground mb-2">Ou sélectionnez une marque</p>
        <div className="flex flex-wrap gap-1.5">
          {/* All Brands Option */}
          <button
            onClick={() => onBrandSelect(null)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              selectedBrand === null
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Toutes
          </button>
          {brands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => onBrandSelect(brand.id)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                selectedBrand === brand.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {brand.name}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Access - Compact */}
      <div className="animate-fade-in pt-2" style={{ animationDelay: "0.3s" }}>
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-3 h-3 text-primary fill-primary" />
          <p className="text-xs tracking-[0.15em] text-muted-foreground font-medium">
            ACCÈS RAPIDE
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Scanner Button */}
          <Button
            size="sm"
            className="rounded-full px-4 py-3 font-display text-sm tracking-wide gap-2 pulse-glow rotate-[-2deg] hover:rotate-0 transition-transform"
          >
            <Sparkles className="w-3 h-3" />
            Scanner
          </Button>

          {/* Mon Garage Button */}
          <Button
            size="sm"
            className="rounded-full px-4 py-3 font-display text-sm tracking-wide gap-2 bg-garage text-garage-foreground hover:bg-garage/90 rotate-[2deg] hover:rotate-0 transition-all"
          >
            <Home className="w-3 h-3" />
            Mon Garage
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommandPanel;
