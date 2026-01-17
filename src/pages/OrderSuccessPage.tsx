import { motion } from "framer-motion";
import { CheckCircle, Home, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const OrderSuccessPage = () => {
  const location = useLocation();
  const orderNumber = location.state?.orderNumber || `PT-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  // Slogan words for stagger animation
  const sloganWords = ["ROULE", "·", "RÉPARE", "·", "DURE"];

  return (
    <div className="min-h-screen bg-greige">
      <Header />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center py-12 md:py-20">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15,
              duration: 0.8 
            }}
            className="mb-8"
          >
            <div className="relative inline-block">
              {/* Glow effect */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 0.3 }}
                transition={{ delay: 0.3, duration: 1, repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-0 rounded-full bg-mineral blur-2xl"
              />
              <CheckCircle className="relative w-24 h-24 md:w-32 md:h-32 text-mineral" strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-display text-4xl md:text-5xl text-carbon tracking-wide mb-4"
          >
            COMMANDE CONFIRMÉE
          </motion.h1>

          {/* Order Number */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-8"
          >
            <p className="text-muted-foreground mb-2">Numéro de commande</p>
            <span className="inline-block px-6 py-3 bg-white/60 backdrop-blur-md rounded-xl border border-mineral/20 font-display text-2xl text-mineral tracking-widest">
              {orderNumber}
            </span>
          </motion.div>

          {/* Thank you message */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-lg text-muted-foreground mb-12 max-w-md mx-auto"
          >
            Merci pour votre confiance ! Votre commande a été enregistrée et vous recevrez un email de confirmation.
          </motion.p>

          {/* Separator */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="h-px bg-gradient-to-r from-transparent via-mineral/40 to-transparent mb-12 max-w-md mx-auto"
          />

          {/* SLOGAN - Monumental Typography with Stagger */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.8
                }
              }
            }}
            className="mb-12"
          >
            <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
              {sloganWords.map((word, index) => (
                <motion.span
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 40, rotateX: -90 },
                    visible: { 
                      opacity: 1, 
                      y: 0, 
                      rotateX: 0,
                      transition: {
                        type: "spring",
                        stiffness: 100,
                        damping: 12
                      }
                    }
                  }}
                  className={`font-display text-3xl md:text-5xl lg:text-6xl tracking-[0.15em] md:tracking-[0.25em] ${
                    word === "·" ? "text-mineral/50" : "text-mineral"
                  }`}
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Separator */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="h-px bg-gradient-to-r from-transparent via-mineral/40 to-transparent mb-12 max-w-md mx-auto"
          />

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                asChild 
                className="h-14 px-8 bg-carbon text-white font-display text-lg tracking-widest rounded-xl"
              >
                <Link to="/" className="flex items-center gap-3">
                  <Home className="w-5 h-5" />
                  RETOUR À L'ACCUEIL
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                asChild 
                variant="outline"
                className="h-14 px-8 border-mineral/30 text-carbon font-display text-lg tracking-widest rounded-xl hover:bg-mineral/10"
              >
                <Link to="/catalogue" className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5" />
                  VOIR LE CATALOGUE
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccessPage;
