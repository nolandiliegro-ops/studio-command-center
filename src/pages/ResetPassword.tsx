import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Lock, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import logoImage from '@/assets/logo-pt.png';

const passwordSchema = z.object({
  password: z.string().min(6, { message: "Minimum 6 caractères" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [resetComplete, setResetComplete] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log('[ResetPassword] 🔍 Vérification du token de récupération...');
    console.log('[ResetPassword] URL hash:', window.location.hash);
    console.log('[ResetPassword] URL search:', window.location.search);
    
    // Supabase place les tokens dans le hash: #access_token=xxx&type=recovery
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type');
    const accessToken = hashParams.get('access_token');
    
    // Check aussi les query params (fallback)
    const searchParams = new URLSearchParams(window.location.search);
    const typeFromQuery = searchParams.get('type');
    
    console.log('[ResetPassword] Token type (hash):', type);
    console.log('[ResetPassword] Token type (query):', typeFromQuery);
    console.log('[ResetPassword] Has access_token:', !!accessToken);
    
    // Écouter l'événement PASSWORD_RECOVERY de Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[ResetPassword] Auth event:', event);
      
      if (event === 'PASSWORD_RECOVERY') {
        console.log('[ResetPassword] ✅ Mode récupération activé');
        setIsRecoveryMode(true);
        setIsCheckingToken(false);
      } else if (event === 'SIGNED_IN' && session) {
        // L'utilisateur s'est connecté via le token de récupération
        console.log('[ResetPassword] ✅ Session établie via recovery token');
        setIsRecoveryMode(true);
        setIsCheckingToken(false);
      }
    });

    // Vérifier si on a un token de type recovery
    if (type === 'recovery' || typeFromQuery === 'recovery') {
      console.log('[ResetPassword] 🔑 Token recovery détecté, attente auth event...');
      
      // Timeout si l'event ne se déclenche pas
      const timeout = setTimeout(() => {
        if (!isRecoveryMode) {
          console.log('[ResetPassword] ⏱️ Timeout - vérification session directe');
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
              console.log('[ResetPassword] ✅ Session active trouvée');
              setIsRecoveryMode(true);
            } else {
              console.log('[ResetPassword] ❌ Pas de session');
              setTokenError('Le lien de réinitialisation est invalide ou a expiré.');
            }
            setIsCheckingToken(false);
          });
        }
      }, 3000);

      return () => {
        clearTimeout(timeout);
        subscription.unsubscribe();
      };
    } else if (!accessToken && !type && !typeFromQuery) {
      // Pas de token du tout
      console.log('[ResetPassword] ❌ Aucun token trouvé');
      setTokenError('Lien de réinitialisation manquant. Demandez un nouveau lien.');
      setIsCheckingToken(false);
    }

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate passwords
    const result = passwordSchema.safeParse({ password, confirmPassword });
    if (!result.success) {
      const fieldErrors: { password?: string; confirmPassword?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === 'password') fieldErrors.password = err.message;
        if (err.path[0] === 'confirmPassword') fieldErrors.confirmPassword = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    console.log('[ResetPassword] 🔄 Mise à jour du mot de passe...');

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        console.error('[ResetPassword] ❌ Erreur:', error.message);
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      console.log('[ResetPassword] ✅ Mot de passe mis à jour');
      setResetComplete(true);
      toast({
        title: "Mot de passe modifié !",
        description: "Vous pouvez maintenant vous connecter.",
      });

      // Déconnexion pour forcer une nouvelle connexion propre
      await supabase.auth.signOut();

      // Redirection après 2 secondes
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);

    } catch (err) {
      console.error('[ResetPassword] ❌ Exception:', err);
      toast({
        title: "Erreur réseau",
        description: "Impossible de contacter le serveur. Réessayez.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Loading state - vérification du token
  if (isCheckingToken) {
    return (
      <div className="min-h-screen bg-greige flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-garage" />
          <p className="text-carbon/60 font-medium">Vérification du lien...</p>
        </div>
      </div>
    );
  }

  // Error state - token invalide
  if (tokenError) {
    return (
      <div className="min-h-screen bg-greige flex flex-col">
        <div className="p-6">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-carbon/60 hover:text-carbon transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Retour à la connexion</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 pb-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <img 
                src={logoImage}
                alt="piècestrottinettes.FR"
                className="h-14 w-auto mx-auto mb-6"
              />
            </div>

            <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="font-display text-2xl text-carbon mb-2">
                LIEN INVALIDE
              </h2>
              <p className="text-carbon/60 mb-6">
                {tokenError}
              </p>
              <Link to="/forgot-password">
                <Button className="w-full bg-garage hover:bg-garage/90 text-garage-foreground h-12">
                  Demander un nouveau lien
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-greige flex flex-col">
      {/* Back link */}
      <div className="p-6">
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-carbon/60 hover:text-carbon transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Retour à la connexion</span>
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <img 
              src={logoImage}
              alt="piècestrottinettes.FR"
              className="h-14 w-auto mx-auto mb-6"
            />
            <h1 className="font-display text-4xl text-carbon tracking-wide">
              NOUVEAU MOT DE PASSE
            </h1>
            <p className="text-carbon/60 mt-2">
              Choisissez un nouveau mot de passe sécurisé
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-lg">
            {resetComplete ? (
              // Success state
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h2 className="font-display text-2xl text-carbon mb-2">
                  MOT DE PASSE MODIFIÉ !
                </h2>
                <p className="text-carbon/60 mb-4">
                  Redirection vers la connexion...
                </p>
                <Loader2 className="w-6 h-6 animate-spin text-garage mx-auto" />
              </div>
            ) : (
              // Form state
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-carbon font-medium">
                    Nouveau mot de passe
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-white/60 border-white/30 focus:border-garage focus:ring-garage/30"
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-carbon font-medium">
                    Confirmer le mot de passe
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-white/60 border-white/30 focus:border-garage focus:ring-garage/30"
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-garage hover:bg-garage/90 text-garage-foreground font-display text-lg tracking-wide h-12"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      RÉINITIALISER
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
