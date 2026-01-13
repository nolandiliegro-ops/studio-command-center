import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Zap, Gauge, Battery } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScooterModel } from "@/data/scooterData";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "framer-motion";
import FavoriteButton from "@/components/garage/FavoriteButton";
import GarageButton from "@/components/garage/GarageButton";

// Centralized image mapping
import { scooterImages } from "@/lib/scooterImageMapping";

interface ScooterCarouselProps {
  models: ScooterModel[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
  totalModels?: number;
  currentIndex?: number;
}

// Parse spec value to number (e.g., "300W" -> 300)
const parseSpecValue = (spec: string): number => {
  return parseInt(spec.replace(/[^\d]/g, "")) || 0;
};

const ScooterCarousel = ({ 
  models, 
  activeIndex, 
  onSelect,
  onNavigatePrev,
  onNavigateNext,
  totalModels = 0,
  currentIndex = 0,
}: ScooterCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
  });

  const [prevActiveId, setPrevActiveId] = useState<string | null>(null);
  const activeModel = models[activeIndex] || models[0];

  // Track model changes for animation trigger
  useEffect(() => {
    if (activeModel && activeModel.id !== prevActiveId) {
      setPrevActiveId(activeModel.id);
    }
  }, [activeModel, prevActiveId]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("select", () => {
        onSelect(emblaApi.selectedScrollSnap());
      });
    }
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (emblaApi && activeIndex !== emblaApi.selectedScrollSnap()) {
      emblaApi.scrollTo(activeIndex);
    }
  }, [emblaApi, activeIndex]);

  const scrollPrev = () => {
    emblaApi?.scrollPrev();
    onNavigatePrev?.();
  };
  
  const scrollNext = () => {
    emblaApi?.scrollNext();
    onNavigateNext?.();
  };

  if (models.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <div className="text-6xl mb-4">🔍</div>
        <p className="text-lg text-muted-foreground text-center">
          Aucun modèle trouvé
        </p>
        <p className="text-sm text-muted-foreground/70 text-center mt-2">
          Essayez une autre recherche
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full">
      {/* Watermark filigrane discret */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="font-display text-[3rem] lg:text-[6rem] xl:text-[8rem] text-muted-foreground/[0.03] tracking-[0.15em] whitespace-nowrap select-none">
          PIECESTROTTINETTES.FR
        </span>
      </div>

      {/* Subtle background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-mineral/20 via-transparent to-transparent"
        />
      </div>

      {/* Soft spotlight effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 50% 35% at 50% 50%, rgba(147,181,161,0.08) 0%, transparent 70%)"
        }}
      />

      {/* Navigation Arrow LEFT - Outside carousel */}
      <motion.div 
        className="absolute left-0 lg:-left-4 xl:-left-8 top-[40%] -translate-y-1/2 z-20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={scrollPrev}
          className="rounded-full w-10 h-10 lg:w-12 lg:h-12 bg-white/90 backdrop-blur-sm border-mineral/20 hover:border-mineral hover:bg-white shadow-lg hover:shadow-xl transition-all"
        >
          <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 text-carbon" />
        </Button>
      </motion.div>

      {/* Navigation Arrow RIGHT - Outside carousel */}
      <motion.div 
        className="absolute right-0 lg:-right-4 xl:-right-8 top-[40%] -translate-y-1/2 z-20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={scrollNext}
          className="rounded-full w-10 h-10 lg:w-12 lg:h-12 bg-white/90 backdrop-blur-sm border-mineral/20 hover:border-mineral hover:bg-white shadow-lg hover:shadow-xl transition-all"
        >
          <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-carbon" />
        </Button>
      </motion.div>

      {/* Main Layout: Carousel */}
      <div className="relative flex items-center justify-center w-full flex-1 px-12 lg:px-16">
        {/* Carousel Container - Compact scooter for above the fold */}
        <div className="relative w-full max-w-4xl overflow-hidden" ref={emblaRef}>
          <div className="flex items-center">
            {models.map((model, index) => {
              const isActive = index === activeIndex;
              const distance = Math.abs(index - activeIndex);
              const scale = isActive ? 1 : Math.max(0.7, 1 - distance * 0.15);
              const opacity = isActive ? 1 : Math.max(0.3, 1 - distance * 0.25);

              // Get the image from our mapping, fallback to model.image
              const imageSrc = scooterImages[model.id] || model.image;

              return (
                <div
                  key={model.id}
                  className="flex-shrink-0 w-full flex items-center justify-center px-4"
                  style={{
                    transform: `scale(${scale})`,
                    opacity,
                    transition: "transform 0.5s ease-out, opacity 0.5s ease-out",
                  }}
                >
                  {/* Compact Scooter Container for above the fold */}
                  <div className="relative w-full max-w-[500px] mx-auto h-[280px] lg:h-[340px] flex items-center justify-center">
                    {/* Favorite & Garage Buttons */}
                    <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5">
                      <FavoriteButton
                        scooterSlug={model.id}
                        scooterName={`${model.brand} ${model.name}`}
                      />
                      <GarageButton
                        scooterSlug={model.id}
                        scooterName={`${model.brand} ${model.name}`}
                      />
                    </div>
                    
                    {/* Elegant Reveal Animation - Subtle */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={model.id}
                        className="relative w-full h-full"
                        initial={{ 
                          opacity: 0, 
                          scale: 0.95,
                          y: 10
                        }}
                        animate={{ 
                          opacity: 1, 
                          scale: 1,
                          y: 0
                        }}
                        exit={{ 
                          opacity: 0, 
                          scale: 0.95,
                          y: -10
                        }}
                        transition={{ 
                          duration: 0.5, 
                          ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                      >
                        {/* Subtle glow effect */}
                        <div
                          className="absolute inset-0 blur-2xl opacity-20"
                          style={{
                            background: "radial-gradient(ellipse at center, rgba(147,181,161,0.3) 0%, transparent 60%)"
                          }}
                        />
                        
                        <img
                          src={imageSrc}
                          alt={`${model.brand} ${model.name}`}
                          className="relative w-full h-[80%] object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                        />
                        
                        {/* Mirror Reflection Effect */}
                        <div className="absolute bottom-0 left-0 right-0 h-[20%] overflow-hidden pointer-events-none">
                          <img
                            src={imageSrc}
                            alt=""
                            className="w-full h-[400%] object-contain opacity-[0.12] blur-[1px]"
                            style={{
                              transform: 'scaleY(-1) translateY(75%)',
                              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 80%)',
                              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 80%)'
                            }}
                          />
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PREMIUM SPECS BAR - Dashboard automobile style - OUTSIDE scooter image */}
      {activeModel && (
        <motion.div
          key={`specs-${activeModel.id}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="w-full max-w-lg px-4 mt-2 z-20"
        >
          <div className="flex items-center justify-center gap-3 lg:gap-6 bg-white/95 backdrop-blur-md rounded-2xl px-4 lg:px-6 py-2.5 lg:py-3 shadow-lg border border-mineral/10">
            {/* Power */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-yellow-500" />
                <span className="font-display text-lg lg:text-xl text-carbon font-bold">
                  {parseSpecValue(activeModel.specs.power)}
                </span>
                <span className="text-[10px] lg:text-xs text-muted-foreground">W</span>
              </div>
              <span className="text-[9px] lg:text-[10px] text-muted-foreground uppercase tracking-wide">Puissance</span>
            </div>
            
            {/* Divider */}
            <div className="h-6 lg:h-8 w-px bg-mineral/20" />
            
            {/* Speed */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-red-500" />
                <span className="font-display text-lg lg:text-xl text-carbon font-bold">
                  {parseSpecValue(activeModel.specs.maxSpeed)}
                </span>
                <span className="text-[10px] lg:text-xs text-muted-foreground">km/h</span>
              </div>
              <span className="text-[9px] lg:text-[10px] text-muted-foreground uppercase tracking-wide">Vitesse</span>
            </div>
            
            {/* Divider */}
            <div className="h-6 lg:h-8 w-px bg-mineral/20" />
            
            {/* Range */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1">
                <Battery className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-green-500" />
                <span className="font-display text-lg lg:text-xl text-carbon font-bold">
                  {parseSpecValue(activeModel.specs.range)}
                </span>
                <span className="text-[10px] lg:text-xs text-muted-foreground">km</span>
              </div>
              <span className="text-[9px] lg:text-[10px] text-muted-foreground uppercase tracking-wide">Autonomie</span>
            </div>
          </div>

          {/* Counter below specs bar */}
          <div className="flex justify-center mt-2">
            <span className="text-xs text-muted-foreground font-medium bg-white/60 px-3 py-1 rounded-full backdrop-blur-sm border border-mineral/10">
              {currentIndex + 1} / {totalModels}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ScooterCarousel;
