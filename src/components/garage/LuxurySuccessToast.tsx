import { motion } from 'framer-motion';
import { Sparkles, Trophy } from 'lucide-react';

interface LuxurySuccessToastProps {
  scooterName: string;
  points: number;
}

const LuxurySuccessToast = ({ scooterName, points }: LuxurySuccessToastProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -50 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 25,
        duration: 0.5 
      }}
      className="relative overflow-hidden rounded-2xl p-6 shadow-2xl"
      style={{
        background: 'linear-gradient(135deg, #F5F3F0 0%, #FFFFFF 100%)',
        border: '2px solid rgba(147, 181, 161, 0.3)',
      }}
    >
      {/* Animated glow effects */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(147, 181, 161, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.3) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating sparkles */}
      <motion.div
        className="absolute top-4 right-4"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Sparkles className="w-6 h-6 text-amber-400" />
      </motion.div>

      <motion.div
        className="absolute bottom-4 left-4"
        animate={{
          rotate: [360, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <Sparkles className="w-4 h-4 text-mineral" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex items-start gap-4">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 15,
            delay: 0.2 
          }}
          className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center relative"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(147, 181, 161, 0.2) 100%)',
            border: '2px solid rgba(147, 181, 161, 0.4)',
          }}
        >
          <Trophy className="w-7 h-7 text-mineral" />
          
          {/* Pulsing glow */}
          <motion.div
            className="absolute inset-0 rounded-xl"
            animate={{
              boxShadow: [
                '0 0 20px rgba(255, 215, 0, 0.3)',
                '0 0 40px rgba(147, 181, 161, 0.5)',
                '0 0 20px rgba(255, 215, 0, 0.3)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Text Content */}
        <div className="flex-1 space-y-1">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="font-display text-lg font-bold text-carbon"
          >
            🎉 Ajouté à votre garage !
          </motion.h3>
          
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="text-sm text-carbon/70"
          >
            <span className="font-semibold text-mineral">{scooterName}</span> est maintenant dans votre collection
          </motion.p>

          {/* Points Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: 0.5, 
              duration: 0.4,
              type: "spring",
              stiffness: 200
            }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mt-2"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(147, 181, 161, 0.15) 100%)',
              border: '1px solid rgba(147, 181, 161, 0.3)',
            }}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-sm">
              <span className="text-amber-600">+{points}</span>{' '}
              <span className="text-mineral">Performance Points</span>
            </span>
          </motion.div>
        </div>
      </div>

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)',
        }}
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
    </motion.div>
  );
};

export default LuxurySuccessToast;
