import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface AddToGarageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scooterName: string;
  onConfirm: (data: { nickname: string; currentKm: number }) => void;
  isLoading?: boolean;
}

const AddToGarageDialog = ({
  open,
  onOpenChange,
  scooterName,
  onConfirm,
  isLoading = false,
}: AddToGarageDialogProps) => {
  const [nickname, setNickname] = useState('');
  const [currentKm, setCurrentKm] = useState('');
  const [errors, setErrors] = useState<{ nickname?: string; currentKm?: string }>({});

  const handleConfirm = () => {
    // Validation
    const newErrors: { nickname?: string; currentKm?: string } = {};
    
    if (!nickname.trim()) {
      newErrors.nickname = 'Le surnom est requis';
    }
    
    if (!currentKm.trim()) {
      newErrors.currentKm = 'Le kilométrage est requis';
    } else if (isNaN(Number(currentKm)) || Number(currentKm) < 0) {
      newErrors.currentKm = 'Veuillez entrer un nombre valide';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Call onConfirm with validated data
    onConfirm({
      nickname: nickname.trim(),
      currentKm: Number(currentKm),
    });

    // Reset form
    setNickname('');
    setCurrentKm('');
    setErrors({});
  };

  const handleCancel = () => {
    setNickname('');
    setCurrentKm('');
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[500px] border-mineral/20"
        style={{ backgroundColor: '#F5F3F0' }}
      >
        {/* Decorative glow effect */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-mineral/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-mineral/10 rounded-full blur-3xl pointer-events-none" />

        <DialogHeader className="relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="w-12 h-12 rounded-xl bg-mineral/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-mineral" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-display text-carbon">
                Ajouter à mon garage
              </DialogTitle>
            </div>
          </motion.div>
          <DialogDescription className="text-carbon/60">
            Ajoutez <span className="font-semibold text-mineral">{scooterName}</span> à votre collection et gagnez{' '}
            <span className="font-bold text-mineral">+100 Performance Points</span> !
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid gap-6 py-4 relative z-10"
        >
          {/* Nickname Field */}
          <div className="space-y-2">
            <Label htmlFor="nickname" className="text-carbon font-medium">
              Surnom de la trottinette
            </Label>
            <Input
              id="nickname"
              placeholder="Ex: Ma Xiaomi, Beast Mode, etc."
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                if (errors.nickname) setErrors({ ...errors, nickname: undefined });
              }}
              className={`bg-white/60 border-mineral/20 focus:border-mineral ${
                errors.nickname ? 'border-red-500' : ''
              }`}
              disabled={isLoading}
            />
            {errors.nickname && (
              <p className="text-xs text-red-500">{errors.nickname}</p>
            )}
          </div>

          {/* Current Mileage Field */}
          <div className="space-y-2">
            <Label htmlFor="currentKm" className="text-carbon font-medium">
              Kilométrage actuel (km)
            </Label>
            <Input
              id="currentKm"
              type="number"
              placeholder="Ex: 150"
              value={currentKm}
              onChange={(e) => {
                setCurrentKm(e.target.value);
                if (errors.currentKm) setErrors({ ...errors, currentKm: undefined });
              }}
              className={`bg-white/60 border-mineral/20 focus:border-mineral ${
                errors.currentKm ? 'border-red-500' : ''
              }`}
              disabled={isLoading}
              min="0"
              step="1"
            />
            {errors.currentKm && (
              <p className="text-xs text-red-500">{errors.currentKm}</p>
            )}
            <p className="text-xs text-carbon/50">
              Entrez le kilométrage actuel de votre trottinette pour un suivi précis
            </p>
          </div>
        </motion.div>

        <DialogFooter className="relative z-10">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="border-mineral/20 hover:bg-white/60"
          >
            Annuler
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#93B5A1' }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Ajout en cours...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Confirmer
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddToGarageDialog;
