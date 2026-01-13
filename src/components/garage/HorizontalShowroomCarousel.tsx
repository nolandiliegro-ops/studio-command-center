import { motion } from 'framer-motion';
import { getScooterImage } from '@/lib/scooterImageMapping';
import { cn } from '@/lib/utils';

interface GarageScooter {
  id: string;
  scooter_model: {
    id: string;
    name: string;
    slug?: string;
    brand: string;
    image_url?: string | null;
    voltage?: number | null;
    amperage?: number | null;
  };
  nickname?: string | null;
  custom_photo_url?: string | null;
}

interface HorizontalShowroomCarouselProps {
  scooters: GarageScooter[];
  selectedScooterId: string | null;
  onScooterSelect: (scooter: GarageScooter) => void;
  className?: string;
}

const HorizontalShowroomCarousel = ({ 
  scooters, 
  selectedScooterId, 
  onScooterSelect,
  className 
}: HorizontalShowroomCarouselProps) => {
  
  if (!scooters || scooters.length === 0) {
    return null;
  }

  return (
    <div className={cn("relative", className)}>
      {/* Title */}
      <div className="mb-3">
        <h3 className="font-display text-sm text-carbon uppercase tracking-wide">
          Mes Trottinettes
        </h3>
        <p className="text-xs text-carbon/50">{scooters.length} dans le garage</p>
      </div>

      {/* Horizontal Scrollable Container */}
      <div className="relative overflow-x-auto pb-4 -mx-4 px-4">
        <div className="flex gap-4 min-w-min">
          {scooters.map((scooter, index) => {
            const isSelected = scooter.id === selectedScooterId;
            const model = scooter.scooter_model;
            const displayName = scooter.nickname || `${model.brand} ${model.name}`;
            const image = getScooterImage(model.slug, model.image_url);

            return (
              <motion.button
                key={scooter.id}
                onClick={() => onScooterSelect(scooter)}
                className={cn(
                  "relative flex-shrink-0 w-48 h-32 rounded-xl overflow-hidden transition-all duration-300",
                  "border-2 bg-white/80 backdrop-blur-sm",
                  isSelected 
                    ? "border-mineral shadow-lg scale-105" 
                    : "border-mineral/20 hover:border-mineral/40 hover:shadow-md"
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -4 }}
              >
                {/* Background with garage floor effect */}
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: 'url(/garage-floor.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />

                {/* Scooter Image */}
                <div className="relative h-full flex items-center justify-center p-3">
                  {image ? (
                    <img
                      src={image}
                      alt={displayName}
                      className="w-full h-full object-contain drop-shadow-md"
                      style={{ transform: 'scale(1.1)' }}
                    />
                  ) : (
                    <div className="text-4xl">🛴</div>
                  )}
                </div>

                {/* Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/95 to-transparent p-2">
                  <p className="text-xs font-semibold text-carbon truncate">
                    {displayName}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {model.voltage && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded">
                        {model.voltage}V
                      </span>
                    )}
                    {model.amperage && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                        {model.amperage}Ah
                      </span>
                    )}
                  </div>
                </div>

                {/* Selected Indicator */}
                {isSelected && (
                  <motion.div
                    layoutId="selectedScooter"
                    className="absolute inset-0 border-2 border-mineral rounded-xl pointer-events-none"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Scroll Indicator */}
      {scooters.length > 4 && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-12 h-full bg-gradient-to-l from-[#F5F3F0] to-transparent" />
        </div>
      )}
    </div>
  );
};

export default HorizontalShowroomCarousel;
