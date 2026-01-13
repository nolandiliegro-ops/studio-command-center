import { useState, useRef, useEffect } from "react";
import { Search, Sparkles, Home, Scan, LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";
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
}

// Brand color mapping - synchronized with filters
const brandColors: Record<string, { bg: string; text: string; border: string }> = {
  dualtron: { bg: "bg-[hsl(43_100%_50%)]", text: "text-yellow-900", border: "border-yellow-500" },
  kaabo: { bg: "bg-[hsl(0_70%_50%)]", text: "text-white", border: "border-red-500" },
  xiaomi: { bg: "bg-[hsl(25_100%_50%)]", text: "text-white", border: "border-orange-500" },
  ninebot: { bg: "bg-[hsl(207_90%_54%)]", text: "text-white", border: "border-blue-500" },
  segway: { bg: "bg-[hsl(145_60%_40%)]", text: "text-white", border: "border-emerald-500" },
};

const CommandPanel = ({
  brands,
  selectedBrand,
  onBrandSelect,
  searchQuery,
  onSearchChange,
  onModelSelect,
  activeModel,
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

  // Get brand color based on active model's brand
  const getBrandColorClasses = (brandId: string | undefined) => {
    if (!brandId) return { bg: "bg-white/80", text: "text-carbon", border: "border-mineral/20" };
    const colors = brandColors[brandId.toLowerCase()];
    return colors || { bg: "bg-white/80", text: "text-carbon", border: "border-mineral/20" };
  };

  const activeBrandColors = getBrandColorClasses(activeModel?.brandId);

  return (
    <div className="flex flex-col justify-start h-full space-y-3">
      {/* CATALOGUE BUTTON - Top of panel (Zone Orange) */}
      <Link to="/catalogue" className="animate-fade-in">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-xl py-3 font-display text-sm tracking-wide gap-2 
                       bg-carbon/5 border-carbon/20 text-carbon hover:bg-carbon hover:text-white 
                       transition-all shadow-sm"
          >
            <LayoutGrid className="w-4 h-4" />
            VOIR LE CATALOGUE
          </Button>
        </motion.div>
      </Link>

      {/* FIRST: Active Model Info - Priority placement */}
      {activeModel && (
        <motion.div 
          key={activeModel.id}
          className="animate-fade-in"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Brand Badge with Dynamic Color */}
          <motion.div
            className={`inline-block px-3 py-1.5 rounded-full ${activeBrandColors.bg} ${activeBrandColors.text} backdrop-blur-sm mb-1.5 shadow-sm`}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-xs font-bold tracking-wide uppercase">
              {activeModel.brand}
            </p>
          </motion.div>

          {/* Model Name */}
          <motion.h3 
            className="font-display text-xl lg:text-2xl text-carbon mb-1.5 tracking-wide leading-tight"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            {activeModel.name}
          </motion.h3>

          {/* Compatible Parts Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-mineral/15 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-muted-foreground text-xs">Pièces compatibles:</span>
            <AnimatedNumber 
              value={activeModel.compatibleParts} 
              className="text-mineral font-bold text-base"
            />
          </motion.div>
        </motion.div>
      )}

      {/* Separator */}
      <div className="border-t border-mineral/10" />

      {/* Section Title - Compact */}
      <div className="animate-fade-in">
        <p className="text-[10px] tracking-[0.2em] text-muted-foreground font-medium mb-0.5">
          RECHERCHER
        </p>
        <h2 className="font-display text-base lg:text-lg text-foreground">
          Identifiez votre trottinette
        </h2>
      </div>

      {/* Search Bar with Dropdown */}
      <div 
        ref={searchContainerRef}
        className="relative animate-fade-in" 
        style={{ animationDelay: "0.1s" }}
      >
        <div className="glass rounded-xl p-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Modèle, marque..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowDropdown(true)}
              className="pl-10 pr-4 py-3 text-sm bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
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

      {/* Brand Selection with Dynamic Colors */}
      <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <p className="text-[10px] text-muted-foreground mb-1.5">Ou sélectionnez une marque</p>
        <div className="flex flex-wrap gap-1">
          {/* All Brands Option */}
          <button
            onClick={() => onBrandSelect(null)}
            className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-all ${
              selectedBrand === null
                ? "bg-carbon text-greige"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Toutes
          </button>
          {brands.map((brand) => {
            const brandColor = brandColors[brand.id.toLowerCase()];
            const isSelected = selectedBrand === brand.id;
            
            return (
              <button
                key={brand.id}
                onClick={() => onBrandSelect(brand.id)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-all ${
                  isSelected && brandColor
                    ? `${brandColor.bg} ${brandColor.text}`
                    : isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {brand.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* SCANNER Button - Premium Redesign with Glow */}
      <div className="animate-fade-in pt-1" style={{ animationDelay: "0.3s" }}>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="relative"
        >
          {/* Glow effect underneath */}
          <div className="absolute -inset-1 bg-mineral/40 rounded-xl blur-xl -z-10 opacity-70" />
          
          <Button
            size="lg"
            className="w-full rounded-xl py-5 font-display text-sm tracking-wider gap-2 
                       bg-gradient-to-r from-mineral to-mineral-dark text-white 
                       hover:from-mineral-dark hover:to-mineral 
                       shadow-lg hover:shadow-xl transition-all border border-mineral-glow/30"
          >
            <div className="relative">
              <Scan className="w-4 h-4" />
              {/* Pulse animation overlay */}
              <span className="absolute inset-0 rounded-full bg-white/40 animate-ping" />
            </div>
            <span>SCANNER MA TROTTINETTE</span>
            <Sparkles className="w-3.5 h-3.5 opacity-70" />
          </Button>
        </motion.div>
        
        {/* Mon Garage - Secondary */}
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2 rounded-xl py-4 font-display text-sm tracking-wide gap-2 
                     bg-garage/10 border-garage/30 text-garage hover:bg-garage hover:text-white transition-all"
        >
          <Home className="w-3.5 h-3.5" />
          Mon Garage
        </Button>
      </div>
    </div>
  );
};

export default CommandPanel;
