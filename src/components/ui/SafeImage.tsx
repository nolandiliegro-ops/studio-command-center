import { useState, ImgHTMLAttributes } from 'react';
import { ImageIcon } from 'lucide-react';

interface SafeImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string | null | undefined;
  alt: string;
  fallback?: React.ReactNode;
  containerClassName?: string;
}

/**
 * SafeImage - Composant d'image robuste avec gestion d'erreur automatique
 * 
 * Empêche les erreurs 404 de casser les queries React Query en gérant
 * automatiquement les images manquantes avec un fallback élégant.
 * 
 * @param src - URL de l'image (peut être null/undefined)
 * @param alt - Texte alternatif
 * @param fallback - Composant de remplacement personnalisé (optionnel)
 * @param containerClassName - Classes CSS pour le conteneur de fallback
 */
export const SafeImage = ({ 
  src, 
  alt, 
  fallback,
  containerClassName = '',
  className = '',
  ...props 
}: SafeImageProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Si pas de src ou erreur de chargement, afficher le fallback
  if (!src || hasError) {
    return (
      <div className={`flex items-center justify-center ${containerClassName}`}>
        {fallback || (
          <ImageIcon className="w-4 h-4 text-muted-foreground opacity-40" />
        )}
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className={`flex items-center justify-center ${containerClassName}`}>
          <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/20 border-t-muted-foreground animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'hidden' : ''}`}
        onError={() => {
          console.warn(`[SafeImage] Failed to load image: ${src}`);
          setHasError(true);
          setIsLoading(false);
        }}
        onLoad={() => setIsLoading(false)}
        loading="lazy"
        {...props}
      />
    </>
  );
};
