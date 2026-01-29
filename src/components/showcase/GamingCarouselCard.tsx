import { motion } from "framer-motion";
import { Package, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/lib/formatPrice";

interface Part {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  image_url: string | null;
  stock_quantity: number | null;
  difficulty_level: number | null;
}

interface GamingCarouselCardProps {
  part: Part;
  isCenter: boolean;
  distanceFromCenter: number;
  index: number;
}

const GamingCarouselCard = ({ 
  part, 
  isCenter, 
  distanceFromCenter,
}: GamingCarouselCardProps) => {
  const navigate = useNavigate();

  // Scale based on distance - central product is ENORMOUS (2.0)
  const getScale = () => {
    if (isCenter) return 2.0;  // ÉNORME - produit central spectaculaire
    if (distanceFromCenter === 1) return 1.1;  // Adjacents plus grands
    if (distanceFromCenter === 2) return 0.9;
    return 0.85;
  };

  // Opacity based on distance - more contrast
  const getOpacity = () => {
    if (isCenter) return 1;
    if (distanceFromCenter === 1) return 0.8;
    if (distanceFromCenter === 2) return 0.6;
    return 0.5;
  };

  // Blur for depth effect
  const getBlur = () => {
    if (isCenter) return 0;
    if (distanceFromCenter === 1) return 0.5;
    if (distanceFromCenter === 2) return 0.8;
    return 1;
  };

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      navigate(`/pieces/${part.slug}`);
    }, 150);
  };

  // Image size based on position - MASSIVE sizes
  const getImageSize = () => {
    if (isCenter) return "600px";      // ÉNORME - 600px × 2.0 = 1200px visuel
    if (distanceFromCenter === 1) return "420px";  // Adjacents imposants
    return "350px";                     // Éloignés
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ 
        opacity: getOpacity(), 
        y: 0,
        scale: getScale(),
        filter: `blur(${getBlur()}px)`,
      }}
      transition={{ 
        duration: 0.6, 
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      onClick={handleClick}
      className={`relative cursor-pointer ${isCenter ? "floating-product-center z-10" : ""}`}
    >
      {/* Floating Product Image */}
      <motion.div
        className="relative"
        whileHover={{ 
          rotateY: isCenter ? 5 : 3,
          scale: 1.03,
        }}
        transition={{ duration: 0.4 }}
        style={{ 
          perspective: "1000px",
          transformStyle: "preserve-3d",
        }}
      >
        {part.image_url ? (
          <img
            src={part.image_url}
            alt={part.name}
            className={`w-full h-auto object-contain mx-auto ${isCenter ? "floating-product-image" : ""}`}
            style={{ 
              maxWidth: getImageSize(),
              maxHeight: getImageSize(),
              filter: isCenter 
                ? undefined // Animation CSS handles the intense glow
                : `drop-shadow(0 15px 30px rgba(26, 26, 26, 0.12))`,
            }}
          />
        ) : (
          <div 
            className="flex items-center justify-center rounded-2xl bg-white/30"
            style={{
              width: getImageSize(),
              height: getImageSize(),
            }}
          >
            <Package className="w-16 h-16 text-carbon/20" />
          </div>
        )}
      </motion.div>

      {/* Product Info - Glassmorphism Card for center */}
      {isCenter && (
        <motion.div 
          className="mt-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Glassmorphism Card */}
          <div 
            className="inline-block px-8 py-6 rounded-2xl"
            style={{
              background: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.5)",
              boxShadow: "0 8px 32px rgba(26, 26, 26, 0.08), 0 0 0 1px rgba(147, 181, 161, 0.1)",
            }}
          >
            {/* Product Name */}
            <h3 className="text-carbon text-xl md:text-2xl font-bold line-clamp-2 mb-3">
              {part.name}
            </h3>
            
            {/* Price with Mineral accent */}
            <span 
              className="text-3xl md:text-4xl font-extrabold block mb-4"
              style={{ color: "hsl(var(--mineral))" }}
            >
              {formatPrice(part.price || 0)}
            </span>
            
            {/* Technical Specs */}
            {part.difficulty_level && (
              <div className="flex justify-center gap-4 mb-4">
                <div 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(147, 181, 161, 0.1)",
                    border: "1px solid rgba(147, 181, 161, 0.2)",
                  }}
                >
                  <span className="text-sm">🔧</span>
                  <span className="text-carbon/70 text-sm font-medium">
                    Difficulté: {part.difficulty_level}/4
                  </span>
                </div>
              </div>
            )}
            
            {/* Compatible Badge */}
            <div className="flex justify-center">
              <div 
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full"
                style={{
                  background: "linear-gradient(135deg, rgba(147, 181, 161, 0.2), rgba(147, 181, 161, 0.1))",
                  border: "1px solid rgba(147, 181, 161, 0.5)",
                  boxShadow: "0 0 20px rgba(147, 181, 161, 0.2)",
                }}
              >
                <ShieldCheck className="w-5 h-5 text-mineral" />
                <span className="text-mineral text-sm font-bold uppercase tracking-wider">
                  100% Compatible
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GamingCarouselCard;
