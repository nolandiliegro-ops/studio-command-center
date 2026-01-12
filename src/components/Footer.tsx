import { Link } from "react-router-dom";
import logoImage from "@/assets/logo-pt.png";

const Footer = () => {
  return (
    <footer className="bg-carbon py-12 mt-auto">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src={logoImage}
            alt="piècestrottinettes.FR"
            className="h-10 w-auto brightness-0 invert opacity-90"
          />
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <h4 className="font-display text-sm tracking-wider text-white/90 mb-4">CATALOGUE</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/catalogue" className="text-white/60 hover:text-white transition-colors text-sm">
                Pièces Détachées
              </Link>
              <Link to="/catalogue" className="text-white/60 hover:text-white transition-colors text-sm">
                Par Marque
              </Link>
              <Link to="/catalogue" className="text-white/60 hover:text-white transition-colors text-sm">
                Par Catégorie
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-display text-sm tracking-wider text-white/90 mb-4">MON COMPTE</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/garage" className="text-white/60 hover:text-white transition-colors text-sm">
                Mon Garage
              </Link>
              <Link to="/login" className="text-white/60 hover:text-white transition-colors text-sm">
                Connexion
              </Link>
              <Link to="/register" className="text-white/60 hover:text-white transition-colors text-sm">
                Créer un compte
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-display text-sm tracking-wider text-white/90 mb-4">RESSOURCES</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/tutos" className="text-white/60 hover:text-white transition-colors text-sm">
                Tutoriels
              </Link>
              <Link to="/pepites" className="text-white/60 hover:text-white transition-colors text-sm">
                Les Pépites
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-display text-sm tracking-wider text-white/90 mb-4">CONTACT</h4>
            <nav className="flex flex-col gap-2">
              <a href="mailto:contact@piecestrottinettes.fr" className="text-white/60 hover:text-white transition-colors text-sm">
                contact@piecestrottinettes.fr
              </a>
            </nav>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Slogan */}
            <p className="font-display text-lg tracking-widest text-mineral">
              ROULE · RÉPARE · DURE
            </p>

            {/* Copyright */}
            <p className="text-white/40 text-sm">
              © 2026 piècestrottinettes.FR — Tous droits réservés
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
