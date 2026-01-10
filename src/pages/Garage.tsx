import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import { Loader2, Award, Car, Heart } from 'lucide-react';

const Garage = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-greige flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-garage" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-greige">
      <Header />
      
      <main className="pt-20 lg:pt-24 px-4 lg:px-8 pb-8">
        <div className="container mx-auto max-w-7xl">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="font-display text-4xl lg:text-5xl text-carbon tracking-wide">
              MON GARAGE
            </h1>
            <p className="text-carbon/60 mt-2">
              Bienvenue, {profile?.display_name || 'Rider'} !
            </p>
          </div>

          {/* Bento Grid - 100vh layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)] min-h-[600px]">
            
            {/* My Stable - Takes 2 columns on desktop */}
            <div className="md:col-span-2 bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-garage/10 flex items-center justify-center">
                  <Car className="w-5 h-5 text-garage" />
                </div>
                <h2 className="font-display text-2xl text-carbon tracking-wide">MY STABLE</h2>
              </div>
              
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-garage/10 mx-auto flex items-center justify-center mb-4">
                    <Car className="w-10 h-10 text-garage/40" />
                  </div>
                  <p className="text-carbon/60 font-medium">Aucun véhicule dans votre garage</p>
                  <p className="text-carbon/40 text-sm mt-1">
                    Ajoutez votre première trottinette depuis le catalogue
                  </p>
                </div>
              </div>
            </div>

            {/* Performance Points */}
            <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-mineral/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-mineral" />
                </div>
                <h2 className="font-display text-2xl text-carbon tracking-wide">POINTS</h2>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center">
                <p className="font-display text-6xl text-mineral">
                  {profile?.performance_points || 0}
                </p>
                <p className="text-carbon/60 font-medium mt-2">Performance Points</p>
                
                <div className="mt-6 px-4 py-2 bg-mineral/10 rounded-full">
                  <span className="text-mineral font-semibold text-sm">🥉 Bronze Rider</span>
                </div>
              </div>
            </div>

            {/* My Collection */}
            <div className="md:col-span-3 bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-garage/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-garage" />
                </div>
                <h2 className="font-display text-2xl text-carbon tracking-wide">MY COLLECTION</h2>
              </div>
              
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-garage/10 mx-auto flex items-center justify-center mb-4">
                    <Heart className="w-8 h-8 text-garage/40" />
                  </div>
                  <p className="text-carbon/60 font-medium">Votre collection est vide</p>
                  <p className="text-carbon/40 text-sm mt-1">
                    Ajoutez des trottinettes à votre wishlist
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Garage;
