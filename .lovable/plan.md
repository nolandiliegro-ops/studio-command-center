

# Amplification des Animations du Carrousel Scooter

## Résumé

Ce plan intensifie considérablement les animations du carrousel de la Hero Section pour un effet visuel beaucoup plus impressionnant et dynamique. Toutes les animations seront amplifiées : transitions plus longues, mouvements plus grands, effets plus visibles.

## Fichier à Modifier

`src/components/hero/ScooterCarousel.tsx`

---

## Modifications Détaillées

### 1. Transition Premium Plus Longue (Lignes 59-62)

**Objectif** : Augmenter la durée à 1 seconde avec une courbe plus fluide

```typescript
// AVANT
const premiumTransition = {
  duration: 0.8,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
};

// APRÈS
const premiumTransition = {
  duration: 1,
  ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number], // easeOutQuart
};
```

---

### 2. Animations Stagger des Specs Amplifiées (Lignes 29-56)

**Objectif** : Slide de 80px, délai de 0.2s entre chaque, bounce très visible

```typescript
// AVANT
const specsContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    }
  }
};

const specItemVariants = {
  hidden: { opacity: 0, x: 20, scale: 0.95 },
  visible: { 
    opacity: 1, x: 0, scale: 1,
    transition: { type: "spring" as const, damping: 15, stiffness: 200 }
  }
};

// APRÈS
const specsContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,  // 0.2s entre chaque
      delayChildren: 0.4,    // Délai initial plus long
    }
  }
};

const specItemVariants = {
  hidden: { 
    opacity: 0, 
    x: 80,      // 80px au lieu de 20px - TRÈS visible
    scale: 0.8  // Plus petit pour effet dramatique
  },
  visible: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      damping: 8,       // Moins amorti = plus de bounce
      stiffness: 120,   // Moins rigide = bounce plus long
      mass: 1.2,        // Plus lourd = rebond visible
    }
  }
};
```

---

### 3. Indicateur de Progression Circulaire Agrandi (Lignes 74-106)

**Objectif** : Cercle plus grand, strokeWidth plus épais, glow effect

```typescript
// AVANT
<div className="relative w-8 h-8 lg:w-10 lg:h-10">
  ...
  strokeWidth="2"
  ...
  <Play className="w-3 h-3 lg:w-4 lg:h-4 text-mineral" />
  <Pause className="w-3 h-3 lg:w-4 lg:h-4 text-mineral/50" />

// APRÈS
<div className="relative w-10 h-10 lg:w-14 lg:h-14">
  ...
  strokeWidth="3"
  // Ajouter filter glow sur le cercle animé
  style={{ 
    transformOrigin: "center",
    filter: "drop-shadow(0 0 6px hsl(var(--mineral) / 0.8))"
  }}
  ...
  <Play className="w-4 h-4 lg:w-5 lg:h-5 text-mineral" />
  <Pause className="w-4 h-4 lg:w-5 lg:h-5 text-mineral/60" />
```

---

### 4. Flèches de Navigation Amplifiées (Lignes 289-302, 305-318)

**Objectif** : Scale 1.2x au hover, rotation subtile, glow effect

```typescript
// AVANT
whileHover={{ scale: 1.1 }}
whileTap={{ scale: 0.9 }}

// APRÈS
whileHover={{ 
  scale: 1.2, 
  rotate: -5,
  boxShadow: "0 8px 25px rgba(147,181,161,0.4)"
}}
whileTap={{ 
  scale: 0.85,
  rotate: 0
}}
transition={{ type: "spring", stiffness: 400, damping: 17 }}
```

---

### 5. Indicateurs de Navigation (Dots) Amplifiés (Lignes 482-501)

**Objectif** : Scale 1.5x au hover, double glow effect très visible

```typescript
// AVANT
whileHover={{ scale: 1.2 }}
whileTap={{ scale: 0.9 }}
animate={{
  boxShadow: isActive 
    ? "0 0 20px hsl(var(--mineral) / 0.6)" 
    : "0 0 0px transparent"
}}
transition={{ duration: 0.3 }}

// APRÈS
whileHover={{ scale: 1.5 }}
whileTap={{ scale: 0.85 }}
animate={{
  scale: isActive ? 1.1 : 1,
  boxShadow: isActive 
    ? "0 0 30px 8px hsl(var(--mineral) / 0.7), 0 0 60px 16px hsl(var(--mineral) / 0.3)" 
    : "0 0 0px transparent"
}}
transition={{ 
  duration: 0.3,
  type: "spring",
  stiffness: 300,
  damping: 15
}}
```

---

### 6. Container Scooter avec Parallax Amplifié (Lignes 574-589)

**Objectif** : Déplacement de 100px, scale plus marqué

```typescript
// AVANT
initial={{ 
  opacity: 0, 
  scale: 0.95,
  x: slideDirection === 'right' ? 60 : -60
}}
animate={{ opacity: 1, scale: 1, x: 0 }}
exit={{ 
  opacity: 0, 
  scale: 0.95,
  x: slideDirection === 'right' ? -40 : 40
}}

// APRÈS
initial={{ 
  opacity: 0, 
  scale: 0.9,                                    // 0.9 au lieu de 0.95
  x: slideDirection === 'right' ? 100 : -100    // 100px au lieu de 60px
}}
animate={{ opacity: 1, scale: 1, x: 0 }}
exit={{ 
  opacity: 0, 
  scale: 0.9,
  x: slideDirection === 'right' ? -80 : 80      // 80px au lieu de 40px
}}
```

---

### 7. Image Scooter avec Parallax Amplifié (Lignes 611-626)

**Objectif** : Déplacement de 150px, ajout scale, transition plus lente (parallax)

```typescript
// AVANT
initial={{ 
  x: slideDirection === 'right' ? 80 : -80,
  opacity: 0 
}}
animate={{ x: 0, opacity: 1 }}
exit={{ 
  x: slideDirection === 'right' ? -50 : 50,
  opacity: 0 
}}
transition={{ duration: 1, ease: [...] }}

// APRÈS
initial={{ 
  x: slideDirection === 'right' ? 150 : -150,   // 150px au lieu de 80px
  opacity: 0,
  scale: 0.95
}}
animate={{ x: 0, opacity: 1, scale: 1 }}
exit={{ 
  x: slideDirection === 'right' ? -100 : 100,   // 100px au lieu de 50px
  opacity: 0,
  scale: 0.95
}}
transition={{ 
  duration: 1.2,                                 // Plus lent = PARALLAX
  ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
}}
```

---

## Résumé des Changements

| Élément | Avant | Après |
|---------|-------|-------|
| Durée transition slide | 0.8s | **1s** |
| Distance slide container | 60px | **100px** |
| Distance slide image (parallax) | 80px | **150px** |
| Stagger delay specs | 0.1s | **0.2s** |
| Slide specs | 20px | **80px** |
| Spring damping (bounce) | 15 | **8** (plus de rebond) |
| Spring stiffness | 200 | **120** (plus souple) |
| Nav dots hover scale | 1.2x | **1.5x** |
| Nav dots glow | 20px simple | **30px + 60px double** |
| Cercle progression | w-10/h-10 | **w-14/h-14** |
| strokeWidth cercle | 2 | **3** |

---

## Résultat Attendu

1. **Transitions dramatiques** : Les slides glissent sur 100px avec un fondu visible pendant 1 seconde
2. **Parallax marqué** : L'image de la trottinette glisse 50% plus lentement que le container (1.2s vs 1s)
3. **Specs en cascade** : Chaque spec (V, Ah, W) arrive avec 0.2s de décalage et un bounce très visible
4. **Navigation réactive** : Les dots grossissent de 50% au survol avec double glow Mineral Green
5. **Progression visible** : Cercle plus grand avec effet lumineux et icônes plus grandes

