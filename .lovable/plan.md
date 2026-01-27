

# Amélioration Typographie & Détails Premium "Studio"

## Résumé

Ce plan améliore la typographie et les détails visuels pour un rendu plus luxueux et "Studio", incluant le slogan avec gradient, les titres de sections avec underline animé, les prix agrandis et les badges glassmorphism.

---

## Fichiers à Modifier

| Fichier | Modification |
|---------|-------------|
| `src/pages/Index.tsx` | Slogan "ROULE RÉPARE DURE" premium |
| `src/components/hero/HeroBranding.tsx` | Titres H1 avec gradient et style automotive |
| `src/components/parts/PartCard.tsx` | Prix agrandis + hover scale |
| `src/components/pepites/FeaturedPartCard.tsx` | Badges glassmorphism + pulse |
| `src/pages/Catalogue.tsx` | Titre section avec underline animé |
| `src/pages/Pepites.tsx` | Titre section avec underline animé |
| `src/index.css` | Nouvelles classes utilitaires |

---

## Modifications Détaillées

### 1. Slogan "ROULE RÉPARE DURE" - Index.tsx (Lignes 73-92)

**Style actuel** : Pill simple avec fond blanc et couleur Mineral Green statique

**Nouveau style** :
- font-weight: 800 (extra-bold)
- letter-spacing: -0.02em (style automotive serré)
- line-height: 0.9 (compact)
- Gradient texte Carbon Black → Mineral Green
- Animation fade-in 0.8s

```typescript
// APRÈS
<motion.div
  className="fixed bottom-4 lg:bottom-8 left-4 lg:left-8 z-50"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
>
  <div 
    className="px-4 py-2 lg:px-6 lg:py-3 rounded-full font-display text-sm lg:text-lg"
    style={{
      background: "rgba(255,255,255,0.9)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(147,181,161,0.3)",
      boxShadow: "0 4px 20px rgba(147,181,161,0.2)",
      fontWeight: 800,
      letterSpacing: "-0.02em",
      lineHeight: 0.9,
    }}
  >
    <span
      style={{
        background: "linear-gradient(135deg, #1A1A1A 0%, #93B5A1 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      ROULE RÉPARE DURE
    </span>
  </div>
</motion.div>
```

---

### 2. CSS Utilitaires - index.css (Ajouter à @layer utilities)

**Nouvelles classes pour underline animé et effets premium** :

```css
/* Underline animé Mineral Green */
.title-underline-animated {
  position: relative;
  display: inline-block;
}

.title-underline-animated::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background: hsl(var(--mineral));
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease-out;
}

.title-underline-animated:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

/* Gradient text Carbon to Mineral */
.text-gradient-carbon-mineral {
  background: linear-gradient(135deg, hsl(var(--carbon)) 0%, hsl(var(--mineral)) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Prix hover scale */
.price-hover:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease-out;
}
```

---

### 3. Titres de Sections - Catalogue.tsx (Lignes 207-214)

**Style actuel** : Titre simple sans effet hover

**Nouveau style** :
- font-weight: 700
- letter-spacing: -0.01em
- Classe `title-underline-animated` pour underline au hover

```typescript
// AVANT
<motion.h1
  className="font-display text-5xl md:text-6xl lg:text-7xl text-carbon tracking-[0.2em] uppercase"
>
  CATALOGUE
</motion.h1>

// APRÈS
<motion.h1
  className="font-display text-5xl md:text-6xl lg:text-7xl text-carbon uppercase cursor-pointer title-underline-animated"
  style={{
    fontWeight: 700,
    letterSpacing: "-0.01em",
  }}
>
  CATALOGUE
</motion.h1>
```

---

### 4. Titres de Sections - Pepites.tsx (Lignes 69-76)

**Même traitement que Catalogue** :

```typescript
// APRÈS
<motion.h1
  className="font-display text-5xl md:text-7xl lg:text-8xl text-carbon mb-6 cursor-pointer title-underline-animated"
  style={{
    fontWeight: 700,
    letterSpacing: "-0.01em",
  }}
>
  LES PÉPITES
</motion.h1>
```

---

### 5. Prix Produits - PartCard.tsx (Lignes 269-278)

**Style actuel** : `text-2xl font-light`

**Nouveau style** :
- font-size: 1.5rem (text-2xl → text-[1.5rem])
- font-weight: 600 (semi-bold)
- Animation scale(1.05) au hover via motion

```typescript
// AVANT
<span className={cn(
  "text-2xl font-light tracking-wide",
  isOutOfStock ? "text-muted-foreground" : "text-mineral"
)}>
  {formatPrice(part.price)}
</span>

// APRÈS
<motion.span 
  whileHover={{ scale: 1.05 }}
  transition={{ duration: 0.2 }}
  className={cn(
    "text-[1.5rem] font-semibold tracking-wide inline-block",
    isOutOfStock ? "text-muted-foreground" : "text-mineral"
  )}
>
  {formatPrice(part.price)}
</motion.span>
```

---

### 6. Badge COMPATIBLE - PartCard.tsx (Lignes 168-175)

**Style actuel** : Fond dynamique basé sur la marque

**Nouveau style glassmorphism** :
- background: rgba(147, 181, 161, 0.8) pour Mineral Green par défaut
- backdrop-filter: blur(10px)
- border: 1px solid rgba(255, 255, 255, 0.3)
- Animation pulse au hover (scale 1.05)

```typescript
// Lignes 155-175 - Modifier le motion.div interne
<motion.div 
  animate={{ 
    boxShadow: [
      `0 0 8px ${selectedBrandColors.glowColor}`,
      `0 0 16px ${selectedBrandColors.glowColor}`,
      `0 0 8px ${selectedBrandColors.glowColor}`,
    ]
  }}
  whileHover={{ scale: 1.05 }}
  transition={{ 
    duration: 2, 
    repeat: Infinity, 
    ease: "easeInOut" 
  }}
  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-semibold tracking-wide uppercase"
  style={{
    background: "rgba(147, 181, 161, 0.8)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
  }}
>
```

---

### 7. Badge SÉLECTION EXPERT - PartCard.tsx (Lignes 199-210)

**Style actuel** : `bg-carbon` avec border simple

**Nouveau style glassmorphism** :

```typescript
// AVANT
<div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-carbon text-white text-[10px] font-medium tracking-widest uppercase shadow-lg backdrop-blur-sm border border-white/10">

// APRÈS
<motion.div 
  whileHover={{ scale: 1.05 }}
  transition={{ duration: 0.2 }}
  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-[10px] font-medium tracking-widest uppercase"
  style={{
    background: "rgba(26, 26, 26, 0.85)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    boxShadow: "0 4px 16px rgba(26, 26, 26, 0.2)",
  }}
>
```

---

### 8. Badge COUP DE CŒUR - FeaturedPartCard.tsx (Lignes 72-79)

**Style actuel** : `bg-mineral` solid

**Nouveau style glassmorphism** :

```typescript
// AVANT
<div className="relative flex items-center gap-2 px-3 py-2 bg-mineral text-white rounded-xl overflow-hidden">

// APRÈS
<motion.div 
  whileHover={{ scale: 1.05 }}
  transition={{ duration: 0.2 }}
  className="relative flex items-center gap-2 px-3 py-2 text-white rounded-xl overflow-hidden"
  style={{
    background: "rgba(147, 181, 161, 0.8)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    boxShadow: "0 4px 16px rgba(147, 181, 161, 0.3)",
  }}
>
```

---

### 9. Prix Monumental - FeaturedPartCard.tsx (Lignes 120-125)

**Style actuel** : `font-display text-4xl text-mineral`

**Nouveau style** :

```typescript
// AVANT
<span className="font-display text-4xl text-mineral tracking-wide">
  {formatPrice(part.price || 0)}
</span>

// APRÈS
<motion.span 
  whileHover={{ scale: 1.05 }}
  transition={{ duration: 0.2 }}
  className="font-display text-[2rem] text-mineral tracking-wide inline-block"
  style={{
    fontWeight: 600,
  }}
>
  {formatPrice(part.price || 0)}
</motion.span>
```

---

## Résumé des Améliorations

| Élément | Avant | Après |
|---------|-------|-------|
| Slogan font-weight | normal | **800 (extra-bold)** |
| Slogan letter-spacing | 0.2em | **-0.02em (automotive)** |
| Slogan texte | Couleur unie | **Gradient Carbon→Mineral** |
| Slogan animation | 0.6s | **0.8s ease-out** |
| Titres sections | tracking-[0.2em] | **letter-spacing: -0.01em** |
| Titres sections hover | Aucun | **Underline animé Mineral 2px** |
| Prix font-size | text-2xl | **1.5rem** |
| Prix font-weight | font-light | **font-semibold (600)** |
| Prix hover | Aucun | **scale(1.05)** |
| Badges background | Solid | **rgba(..., 0.8) glassmorphism** |
| Badges backdrop-filter | Aucun | **blur(10px)** |
| Badges border | Simple | **1px solid rgba(255,255,255,0.3)** |
| Badges hover | Aucun | **scale(1.05) pulse** |

---

## Résultat Attendu

1. **Slogan premium** : Typographie serrée style automotive avec gradient élégant
2. **Titres dynamiques** : Underline animé Mineral Green au survol
3. **Prix impactants** : Plus grands, plus visibles, avec micro-interaction au hover
4. **Badges glassmorphism** : Effet verre dépoli cohérent sur tous les badges

