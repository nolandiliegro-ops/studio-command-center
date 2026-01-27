

# Micro-Interactions "Studio" - Phase Finale

## Résumé

Ce plan ajoute des micro-interactions élégantes et fluides pour finaliser l'expérience "Studio" premium : boutons CTA avec glow effect, cards produits avec lift et zoom image, filtres de catégories avec animations, et transitions de page avec fade-in.

---

## Fichiers à Modifier

| Fichier | Modification |
|---------|-------------|
| `src/components/ui/button.tsx` | Nouveau variant "cta" avec glow Mineral Green |
| `src/components/hero/HeroBranding.tsx` | CTA "VOIR TOUT LE CATALOGUE" premium |
| `src/components/hero/ScooterCarousel.tsx` | CTA "DÉCOUVRIR LES X PIÈCES" enhanced |
| `src/components/CompatiblePartsSection.tsx` | CTA "VOIR LES X PIÈCES" enhanced |
| `src/components/parts/PartCard.tsx` | Card hover translateY + image scale |
| `src/components/catalogue/CategoryBentoGrid.tsx` | Filters avec glow active + hover scale |
| `src/components/catalogue/SubCategoryBar.tsx` | Filters avec glow et transitions |
| `src/pages/Catalogue.tsx` | Stagger animation sur grid de cards |
| `src/pages/Index.tsx` | Page fade-in global |
| `src/index.css` | Nouvelles classes utilitaires |

---

## Modifications Détaillées

### 1. Button Variant "CTA" - button.tsx

**Ajouter un nouveau variant avec effets premium** :

```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // NOUVEAU: CTA Premium avec glow
        cta: "bg-mineral text-white hover:bg-mineral-dark hover:shadow-[0_8px_30px_rgba(147,181,161,0.5)] hover:scale-105 active:scale-[0.98]",
      },
      // ... rest unchanged
    },
  },
);
```

---

### 2. CTA "VOIR TOUT LE CATALOGUE" - HeroBranding.tsx (Lignes 59-67)

**Ajouter motion wrapper avec scale et glow** :

```typescript
import { motion } from "framer-motion";

// Remplacer le div par motion.div
<motion.div 
  className="mt-6 lg:mt-8 animate-fade-in" 
  style={{ animationDelay: "0.5s" }}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
>
  <Button 
    asChild 
    variant="outline" 
    size="lg" 
    className="rounded-full gap-3 px-8 py-6 text-lg font-semibold border-mineral/40 hover:bg-mineral hover:text-white hover:border-mineral transition-all shadow-md hover:shadow-[0_8px_30px_rgba(147,181,161,0.5)]"
  >
    <Link to="/catalogue">
      <ShoppingBag className="w-5 h-5" />
      VOIR TOUT LE CATALOGUE
    </Link>
  </Button>
</motion.div>
```

---

### 3. CTA "DÉCOUVRIR LES X PIÈCES" - ScooterCarousel.tsx (Lignes 463-480)

**Amplifier les effets hover du bouton Bridge** :

```typescript
// AVANT
className="group relative flex items-center gap-2 lg:gap-4 
           ...
           hover:scale-105 active:scale-100
           transition-all duration-300"

// APRÈS
className="group relative flex items-center gap-2 lg:gap-4 
           px-5 py-3 lg:px-10 lg:py-5 
           bg-carbon text-greige 
           font-display text-sm lg:text-xl tracking-wide
           rounded-full border border-white/10
           shadow-[0_8px_32px_rgba(28,28,28,0.4)]
           hover:shadow-[0_12px_48px_rgba(147,181,161,0.4)]
           hover:scale-105 active:scale-[0.98]
           transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
```

---

### 4. CTA "VOIR LES X PIÈCES" - CompatiblePartsSection.tsx (Lignes 145-152)

**Wrapper motion avec glow effect** :

```typescript
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
  className="mt-8 lg:mt-12 text-center"
>
  <Button
    onClick={handleViewAll}
    className="rounded-full px-8 py-6 font-display text-base tracking-wide gap-2 bg-carbon text-greige hover:bg-carbon/90 hover:shadow-[0_8px_30px_rgba(147,181,161,0.4)] transition-all duration-300"
  >
    VOIR LES {totalCount} PIÈCES
    <ArrowRight className="w-5 h-5" />
  </Button>
</motion.div>
```

---

### 5. Cards Produits Enhanced - PartCard.tsx

**Lignes 111-131 : Ajouter translateY(-8px) et améliorer les transitions** :

```typescript
<motion.div
  ref={ref}
  initial={{ opacity: 0, y: 20, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0, y: -10, scale: 0.95 }}
  whileHover={{ 
    scale: 1.02, 
    y: -8,
    transition: { duration: 0.4, ease: "easeOut" }
  }}
  whileTap={{ scale: 0.98 }}
  transition={{
    duration: 0.4,
    delay: index * 0.1, // Stagger pour fade-in
    ease: [0.25, 0.46, 0.45, 0.94],
  }}
  className={cn(
    "group relative rounded-xl p-5 cursor-pointer",
    // Glassmorphism base
    "bg-[rgba(245,243,240,0.7)] backdrop-blur-[20px]",
    "border border-white/20",
    "shadow-[0_8px_32px_rgba(26,26,26,0.1)]",
    // Hover shadow enhanced
    "hover:shadow-[0_16px_48px_rgba(26,26,26,0.15)]",
    // Transition fluide
    "transition-all duration-400 ease-out",
    className
  )}
>
```

**Lignes 224-229 : Image avec scale(1.1) au hover** :

```typescript
// L'image a déjà un scale dans className, vérifier qu'il est bien:
className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
```

---

### 6. Filtres Catégories - CategoryBentoGrid.tsx

**Lignes 62-99 : Ajouter whileHover scale et glow effect sur active** :

```typescript
{/* "Toutes" button */}
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.3 }}
  onClick={() => onCategoryChange(null)}
  className={cn(
    "relative w-24 md:w-28 lg:w-32 aspect-[4/5] rounded-2xl overflow-hidden flex-shrink-0 border border-white/10",
    "transition-all duration-300",
    activeCategory === null && "ring-2 ring-mineral ring-offset-2 ring-offset-greige"
  )}
  style={activeCategory === null ? {
    boxShadow: "0 0 20px 4px rgba(147, 181, 161, 0.5)"
  } : {}}
>
```

**Répéter pour chaque bouton catégorie (lignes 107-156)** :

```typescript
<motion.button
  key={category.id}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.3 }}
  onClick={() => onCategoryChange(category.id)}
  className={cn(
    "relative w-24 md:w-28 lg:w-32 aspect-[4/5] rounded-2xl overflow-hidden flex-shrink-0 border border-white/10",
    "transition-all duration-300",
    isActive && "ring-2 ring-mineral ring-offset-2 ring-offset-greige"
  )}
  style={isActive ? {
    boxShadow: "0 0 20px 4px rgba(147, 181, 161, 0.5)"
  } : {}}
>
```

---

### 7. Sous-Catégories - SubCategoryBar.tsx

**Lignes 40-57 : Améliorer les transitions des boutons** :

```typescript
{/* "Tous" button */}
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.3 }}
  onClick={() => onSubCategoryChange(null)}
  className={cn(
    "px-4 py-2 rounded-full text-sm font-montserrat font-medium transition-all duration-300",
    activeSubCategory === null
      ? "bg-mineral text-white shadow-[0_0_16px_rgba(147,181,161,0.5)]"
      : "bg-white/80 text-carbon hover:bg-white hover:shadow-sm border border-white/50"
  )}
>
  Tous
</motion.button>

{/* Sub-category buttons */}
{subCategories.map((subCat, index) => (
  <motion.button
    key={subCat.id}
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => onSubCategoryChange(subCat.id)}
    className={cn(
      "px-4 py-2 rounded-full text-sm font-montserrat font-medium transition-all duration-300",
      activeSubCategory === subCat.id
        ? "bg-mineral text-white shadow-[0_0_16px_rgba(147,181,161,0.5)]"
        : "bg-white/80 text-carbon hover:bg-white hover:shadow-sm border border-white/50"
    )}
  >
    {subCat.name}
  </motion.button>
))}
```

---

### 8. Grid Stagger Animation - Catalogue.tsx

**Lignes 299-310 : Ajouter staggerChildren pour fade-in en cascade** :

```typescript
<motion.div
  key={activeCategory || "all"}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7"
>
  {parts.map((part, index) => (
    <motion.div
      key={part.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1, // 0.1s stagger
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      <PartCard part={part} index={index} />
    </motion.div>
  ))}
</motion.div>
```

---

### 9. Page Fade-In Global - Index.tsx

**Lignes 26-27 : Wrapper motion pour la page entière** :

```typescript
<motion.div 
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
  className="min-h-screen bg-gradient-to-b from-[hsl(30_10%_97%)] via-[hsl(30_10%_96%)] to-[hsl(30_14%_95%)] watermark-brand"
>
```

---

### 10. CSS Utilitaires - index.css

**Ajouter les transitions globales** :

```css
/* Smooth scroll global */
html {
  scroll-behavior: smooth;
}

/* CTA Glow Effect */
.cta-glow {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cta-glow:hover {
  box-shadow: 0 8px 30px rgba(147, 181, 161, 0.5);
  transform: scale(1.05);
}

.cta-glow:active {
  transform: scale(0.98);
}

/* Filter Glow Active */
.filter-glow-active {
  box-shadow: 0 0 20px 4px rgba(147, 181, 161, 0.5);
}
```

---

## Résumé des Micro-Interactions

| Élément | Hover | Active | Transition |
|---------|-------|--------|------------|
| Boutons CTA | scale(1.05) + glow Mineral | scale(0.98) | 0.3s cubic-bezier |
| Cards produits | translateY(-8px) + shadow enhanced | scale(0.98) | 0.4s ease-out |
| Images produits | scale(1.1) | - | 0.5s ease-out |
| Filtres catégories | scale(1.05) | scale(0.98) | 0.3s |
| Filtre actif | glow Mineral Green | - | 0.3s |
| Grid de résultats | stagger 0.1s fade-in | - | 0.4s |
| Pages | fade-in 0.5s | - | ease-out |
| Scroll | smooth | - | native |

---

## Résultat Attendu

1. **Boutons CTA impactants** : Scale up + glow Mineral Green au survol, feedback tactile au clic
2. **Cards produits fluides** : Lift effect de 8px + ombre renforcée, images qui zooment à l'intérieur
3. **Filtres réactifs** : Glow visible sur le filtre actif, scale léger au survol
4. **Résultats en cascade** : Chaque card apparaît avec 0.1s de décalage pour un effet "wave"
5. **Navigation douce** : Smooth scroll entre sections, fade-in des pages

