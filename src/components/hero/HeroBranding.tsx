const HeroBranding = () => {
  return (
    <div className="flex flex-col justify-start">
      {/* Subtitle */}
      <p className="text-[8px] lg:text-xs tracking-[0.2em] lg:tracking-[0.3em] text-muted-foreground font-medium mb-1 lg:mb-2 animate-fade-in text-center lg:text-left">
        SPÉCIALISTE TROTTINETTES
      </p>

      {/* Giant Title Stack - MAXIMUM Impact Typography */}
      {/* Mobile: Compact horizontal | Desktop: Giant vertical stack */}
      <div className="relative">
        <h1 className="font-display text-3xl sm:text-4xl lg:text-[7rem] xl:text-[9rem] 2xl:text-[11rem] leading-[0.85] lg:leading-[0.65] tracking-[-0.01em] lg:tracking-[-0.02em]">
          {/* Mobile: Horizontal layout | Desktop: Vertical stack */}
          <div className="flex flex-row lg:flex-col items-center lg:items-start justify-center lg:justify-start gap-1 lg:gap-0">
            {/* ROULE */}
            <div className="relative flex items-center animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <span className="hidden lg:block absolute left-2 top-1 text-muted-foreground/15 -z-10 select-none">ROULE</span>
              <span className="text-foreground">ROULE</span>
              <span 
                className="hidden lg:block ml-2 lg:ml-3 text-[9px] lg:text-[11px] tracking-[0.2em] text-muted-foreground font-sans font-medium"
                style={{ writingMode: 'vertical-rl' }}
              >
                QUALITÉ
              </span>
            </div>
            
            {/* RÉPARE */}
            <div className="relative flex items-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <span className="hidden lg:block absolute left-2 top-1 text-muted-foreground/15 -z-10 select-none">RÉPARE</span>
              <span className="text-primary">RÉPARE</span>
              <span 
                className="hidden lg:block ml-2 lg:ml-3 text-[9px] lg:text-[11px] tracking-[0.2em] text-muted-foreground font-sans font-medium"
                style={{ writingMode: 'vertical-rl' }}
              >
                PIÈCES
              </span>
            </div>
            
            {/* DURE */}
            <div className="relative flex items-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <span className="hidden lg:block absolute left-2 top-1 text-muted-foreground/15 -z-10 select-none">DURE</span>
              <span className="text-foreground">DURE</span>
              <span 
                className="hidden lg:block ml-2 lg:ml-3 text-[9px] lg:text-[11px] tracking-[0.2em] text-muted-foreground font-sans font-medium"
                style={{ writingMode: 'vertical-rl' }}
              >
                SERVICE
              </span>
            </div>
          </div>
        </h1>
      </div>

      {/* Description - hidden on mobile, visible on desktop */}
      <p className="hidden lg:block mt-3 lg:mt-4 text-sm text-muted-foreground max-w-sm animate-fade-in" style={{ animationDelay: "0.4s" }}>
        Trouvez les pièces détachées compatibles avec votre trottinette électrique.
      </p>
    </div>
  );
};

export default HeroBranding;
