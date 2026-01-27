

# Gaming Carousel - Version Élégante Fond Greige

## Résumé

Transformation du carrousel gaming pour adopter un fond Greige élégant (ni trop clair, ni trop sombre) avec des cards blanches en glassmorphism. Le style gaming est conservé (glow, animations) mais l'esthétique devient plus luxueuse et équilibrée.

---

## Fichiers à Modifier

| Fichier | Action |
|---------|--------|
| `src/components/showcase/GamingCarousel.tsx` | MODIFIER - Fond Greige + pleine largeur + navigation adaptée |
| `src/components/showcase/GamingCarouselCard.tsx` | MODIFIER - Cards blanches glassmorphism + texte Carbon Black |
| `src/components/CompatiblePartsSection.tsx` | MODIFIER - Supprimer container pour pleine largeur |
| `src/index.css` | MODIFIER - Adapter les effets gaming au fond clair |

---

## Palette de Couleurs

```text
+------------------------------------------+
|  FOND GREIGE                             |
|  #D5D3CE ou gradient F5F3F0 → D5D3CE     |
|                                          |
|    +---------------------------+         |
|    |  CARD BLANCHE             |         |
|    |  rgba(255,255,255,0.85)   |         |
|    |  backdrop-blur: 20px      |         |
|    |                           |         |
|    |  Texte: Carbon #1A1A1A   |         |
|    |  Prix: Mineral #93B5A1    |         |
|    +---------------------------+         |
|                                          |
+------------------------------------------+
```

---

## 1. GamingCarousel.tsx - Fond Greige Élégant

**Changements de Fond** :

| Avant | Après |
|-------|-------|
| `#0a0a0a` (noir pur) | `#D5D3CE` (Greige foncé) |
| Gradient noir | `linear-gradient(180deg, #F5F3F0 0%, #D5D3CE 100%)` |
| Texte blanc | Texte Carbon Black |
| Grille néon visible | Grille très subtile (opacity 0.03) |

**Nouveau Background** :

```typescript
style={{
  background: "linear-gradient(180deg, #F5F3F0 0%, #D5D3CE 100%)",
}}
```

**Header avec Texte Sombre** :

```typescript
{activeModelName && (
  <motion.div className="text-center pt-8 pb-4 relative z-10">
    <span className="text-carbon/50 text-sm uppercase tracking-widest">
      Pour votre
    </span>
    <h3 className="text-carbon font-display text-xl md:text-2xl tracking-wide">
      {activeModelName}
    </h3>
  </motion.div>
)}
```

**Navigation Arrows Adaptée** :

```typescript
<div 
  className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex items-center justify-center rounded-full transition-all duration-300"
  style={{
    background: "rgba(255, 255, 255, 0.9)",
    border: "1px solid rgba(147, 181, 161, 0.3)",
    boxShadow: "0 4px 20px rgba(26, 26, 26, 0.1), 0 0 20px rgba(147, 181, 161, 0.15)",
  }}
>
  <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-mineral" />
</div>
```

**Pagination Dots Adaptée** :

```typescript
<button
  className={`transition-all duration-300 rounded-full ${
    index === selectedIndex 
      ? "w-8 h-2 bg-mineral shadow-[0_0_10px_rgba(147,181,161,0.5)]" 
      : "w-2 h-2 bg-carbon/20 hover:bg-carbon/40"
  }`}
/>
```

**Counter Adapté** :

```typescript
<div className="absolute bottom-4 right-4 text-carbon/30 text-sm font-mono">
  {selectedIndex + 1} / {parts.length}
</div>
```

**Empty State Adapté** :

```typescript
<div 
  className="relative w-full overflow-hidden flex flex-col items-center justify-center py-20"
  style={{
    background: "linear-gradient(180deg, #F5F3F0 0%, #D5D3CE 100%)",
    minHeight: "400px",
  }}
>
  <Sparkles className="w-16 h-16 text-mineral mb-4" />
  <p className="text-carbon/60 text-lg">Aucune pièce compatible trouvée</p>
</div>
```

**Skeleton Adapté** :

```typescript
const GamingCarouselSkeleton = () => (
  <div 
    className="relative w-full overflow-hidden py-12"
    style={{
      background: "linear-gradient(180deg, #F5F3F0 0%, #D5D3CE 100%)",
      minHeight: "500px",
    }}
  >
    <div className="flex items-center justify-center gap-6 md:gap-8 px-5 md:px-10 lg:px-20">
      {[...Array(5)].map((_, i) => (
        <Skeleton 
          key={i} 
          className={`rounded-[20px] bg-white/50 flex-shrink-0 ${
            i === 2 ? "w-[300px] h-[420px]" : "w-[260px] h-[380px]"
          }`} 
        />
      ))}
    </div>
  </div>
);
```

**Layout Pleine Largeur** :

```typescript
<div className="py-10 md:py-14 px-5 md:px-10 lg:px-20">
  <div className="overflow-hidden" ref={emblaRef}>
    <div className="flex gap-6 md:gap-8">
      {/* Cards avec width: clamp(240px, 20vw, 300px) */}
    </div>
  </div>
</div>
```

---

## 2. GamingCarouselCard.tsx - Cards Blanches Glassmorphism

**Changements Visuels** :

| Élément | Avant | Après |
|---------|-------|-------|
| Background | `rgba(26, 26, 26, 0.85)` | `rgba(255, 255, 255, 0.85)` |
| Border color | `rgba(147, 181, 161, 0.25)` | `rgba(147, 181, 161, 0.25)` (inchangé) |
| Border-radius | 16px | 20px |
| Nom produit | Blanc | `#1A1A1A` (Carbon Black) |
| Prix | Mineral Green | Mineral Green (inchangé) |
| Texte rating | `white/50` | `carbon/50` |
| Texte stock | `white/50` | `carbon/50` |
| Scale center | 1.1 | 1.2 |
| Image max-width | 200px | 280px |
| Hover lift | -12px | -12px (inchangé) |

**Nouveau Background Card** :

```typescript
style={{
  background: "rgba(255, 255, 255, 0.85)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: isCenter 
    ? "2px solid rgba(147, 181, 161, 0.5)" 
    : "1px solid rgba(147, 181, 161, 0.2)",
  borderRadius: "20px",
  boxShadow: isCenter 
    ? "0 12px 40px rgba(147, 181, 161, 0.25), 0 8px 32px rgba(26, 26, 26, 0.08)"
    : "0 8px 32px rgba(26, 26, 26, 0.08)",
}}
```

**Nouveau getScale()** :

```typescript
const getScale = () => {
  if (isCenter) return 1.2;
  if (distanceFromCenter === 1) return 1;
  return 0.95;
};
```

**Nouveau getOpacity()** :

```typescript
const getOpacity = () => {
  if (isCenter) return 1;
  if (distanceFromCenter === 1) return 0.85;
  return 0.7;
};
```

**Spotlight Adapté** :

```typescript
{isCenter && (
  <div 
    className="absolute inset-0 pointer-events-none"
    style={{
      background: "radial-gradient(circle at 50% 30%, rgba(147, 181, 161, 0.1) 0%, transparent 60%)",
    }}
  />
)}
```

**Spotlight Behind Image** :

```typescript
<div 
  className="absolute inset-0 -z-10"
  style={{
    background: "radial-gradient(circle at 50% 50%, rgba(147, 181, 161, 0.15) 0%, transparent 70%)",
    filter: "blur(20px)",
    transform: "scale(1.2)",
  }}
/>
```

**Image Agrandie** :

```typescript
<motion.div
  className="relative w-full aspect-square max-w-[280px] mx-auto"
  whileHover={{ 
    rotateY: 10,
    scale: 1.05,
  }}
  transition={{ duration: 0.4 }}
  style={{ perspective: "800px" }}
>
```

**Nom Produit Carbon Black** :

```typescript
<h3 
  className="text-carbon text-sm md:text-base font-semibold line-clamp-2 text-center min-h-[40px]"
>
  {part.name}
</h3>
```

**Rating Stars Adaptées** :

```typescript
<span className="text-carbon/50 text-xs ml-1">({reviewCount})</span>
```

**Stock Status Adapté** :

```typescript
<span className="text-carbon/60 text-xs">
  {part.stock_quantity > 0 ? (
    <span className="flex items-center gap-1">
      <Check className="w-3 h-3 text-green-500" />
      En stock
    </span>
  ) : "Rupture"}
</span>
```

**Placeholder Icon Adapté** :

```typescript
<Package className="w-16 h-16 text-carbon/20" />
```

---

## 3. CompatiblePartsSection.tsx - Pleine Largeur

**Changements** :

| Avant | Après |
|-------|-------|
| `<div className="container mx-auto px-4 lg:px-8">` | `<div className="w-full">` |
| Header dans container | Header avec padding interne |

**Nouvelle Structure** :

```typescript
return (
  <div className="w-full">
    {/* Header avec padding responsive */}
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-center mb-8 lg:mb-12 px-4 md:px-10 lg:px-20"
    >
      {/* Titre et Badge existants - inchangés */}
    </motion.div>

    {/* Gaming Carousel pleine largeur */}
    <GamingCarousel 
      parts={parts}
      activeModelName={activeModelName}
      isLoading={isLoading}
    />
  </div>
);
```

---

## 4. index.css - Effets Adaptés au Fond Clair

**Changements** :

| Élément | Avant | Après |
|---------|-------|-------|
| Grid lines color | `rgba(147, 181, 161, 0.03)` | `rgba(147, 181, 161, 0.05)` |
| Grid pulse opacity | 0.3 → 0.6 | 0.2 → 0.4 |
| centerCardPulse | Shadow dark | Shadow clair adapté |

**Nouveau .gaming-grid-bg** :

```css
.gaming-grid-bg {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(147, 181, 161, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(147, 181, 161, 0.05) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridPulse 6s ease-in-out infinite;
  pointer-events: none;
}

@keyframes gridPulse {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.4; }
}
```

**Nouveau centerCardPulse** :

```css
@keyframes centerCardPulse {
  0%, 100% {
    box-shadow: 0 12px 40px rgba(147, 181, 161, 0.25), 0 8px 32px rgba(26, 26, 26, 0.08);
  }
  50% {
    box-shadow: 0 16px 50px rgba(147, 181, 161, 0.35), 0 12px 40px rgba(26, 26, 26, 0.1);
  }
}
```

**Nouveau gaming-nav-btn hover** :

```css
.gaming-nav-btn:hover > div {
  box-shadow: 0 8px 30px rgba(147, 181, 161, 0.4), 0 4px 20px rgba(26, 26, 26, 0.1);
}
```

---

## Récapitulatif des Valeurs Finales

| Propriété | Valeur |
|-----------|--------|
| **Fond** | `linear-gradient(180deg, #F5F3F0 0%, #D5D3CE 100%)` |
| **Card background** | `rgba(255, 255, 255, 0.85)` |
| **Card backdrop-blur** | `20px` |
| **Card border** | `1px solid rgba(147, 181, 161, 0.2)` |
| **Card border center** | `2px solid rgba(147, 181, 161, 0.5)` |
| **Card border-radius** | `20px` |
| **Card shadow** | `0 8px 32px rgba(26, 26, 26, 0.08)` |
| **Nom produit** | `#1A1A1A` (Carbon Black) |
| **Prix** | `#93B5A1` (Mineral Green) |
| **Scale center** | `1.2` |
| **Scale latéral 1** | `1` |
| **Scale latéral 2+** | `0.95` |
| **Opacity center** | `1` |
| **Opacity latéral 1** | `0.85` |
| **Opacity latéral 2+** | `0.7` |
| **Image max-width** | `280px` |
| **Hover lift** | `-12px` |
| **Transition** | `0.8s ease-out` |
| **Padding desktop** | `80px` (px-20) |
| **Gap cards** | `32px` (gap-8) |

---

## Résultat Attendu

1. **Fond élégant Greige** : Ni trop clair, ni trop sombre - équilibre parfait
2. **Cards blanches glassmorphism** : Lisibilité maximale, style luxueux
3. **Texte Carbon Black** : Contraste parfait sur fond clair
4. **Prix Mineral Green** : Accent de couleur conservé
5. **Effets gaming subtils** : Glow et animations présents mais raffinés
6. **Pleine largeur** : Impact visuel maximal
7. **Profondeur marquée** : Card centrale scale 1.2 avec effet de focus

