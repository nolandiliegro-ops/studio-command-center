import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, UserPlus, ArrowLeft, Gift } from 'lucide-react';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

const registerSchema = z.object({
  displayName: z.string().trim().min(2, { message: "Nom minimum 2 caractères" }).max(50, { message: "Nom maximum 50 caractères" }),
  email: z.string().trim().email({ message: "Email invalide" }),
  password: z.string().min(6, { message: "Mot de passe minimum 6 caractères" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

const Register = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ 
    displayName?: string; 
    email?: string; 
    password?: string; 
    confirmPassword?: string;
  }>({});
  
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate inputs
    const result = registerSchema.safeParse({ displayName, email, password, confirmPassword });
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof typeof errors;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(email, password, displayName);
    setIsLoading(false);

    if (error) {
      if (error.message.includes("already registered")) {
        toast({
          title: "Compte existant",
          description: "Un compte existe déjà avec cet email. Connectez-vous.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur d'inscription",
          description: error.message,
          variant: "destructive",
        });
      }
      return;
    }

    toast({
      title: "Bienvenue ! 🎉",
      description: "Votre compte a été créé avec 100 points de bienvenue !",
    });
    navigate('/garage');
  };

  return (
    <div className="min-h-screen bg-greige flex flex-col">
      {/* Back link */}
      <div className="p-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-carbon/60 hover:text-carbon transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Retour à l'accueil</span>
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-garage mx-auto flex items-center justify-center text-garage-foreground font-display text-3xl mb-4">
              PT
            </div>
            <h1 className="font-display text-4xl text-carbon tracking-wide">CRÉER UN COMPTE</h1>
            <p className="text-carbon/60 mt-2">Rejoignez la communauté des riders</p>
          </div>

          {/* Welcome bonus badge */}
          <div className="bg-mineral/10 border border-mineral/30 rounded-xl p-4 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-mineral/20 flex items-center justify-center">
              <Gift className="w-5 h-5 text-mineral" />
            </div>
            <div>
              <p className="font-semibold text-carbon">100 Points Offerts</p>
              <p className="text-sm text-carbon/60">Bonus de bienvenue à l'inscription</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-carbon font-medium">
                  Nom de rider
                </Label>
                <Input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Speed Demon"
                  className="bg-white/60 border-white/30 focus:border-garage focus:ring-garage/30"
                  disabled={isLoading}
                />
                {errors.displayName && (
                  <p className="text-sm text-destructive">{errors.displayName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-carbon font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="bg-white/60 border-white/30 focus:border-garage focus:ring-garage/30"
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-carbon font-medium">
                  Mot de passe
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-white/60 border-white/30 focus:border-garage focus:ring-garage/30"
                  disabled={isLoading}
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
                    <UserPlus className="w-5 h-5 mr-2" />
                    CRÉER MON COMPTE
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-carbon/60">
                Déjà un compte ?{' '}
                <Link 
                  to="/login" 
                  className="text-garage font-semibold hover:text-garage/80 transition-colors"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
