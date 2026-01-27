

# Correction Urgente : TVA Manquante dans le Montant Stripe

## Problème Critique Identifié

Les prix envoyés à Stripe sont en **HT (Hors Taxes)** au lieu de **TTC (Toutes Taxes Comprises)**. Le client est facturé 66.90 € au lieu de 79.30 €, causant une perte de 12.40 € (la TVA) sur chaque commande.

## Analyse Technique

Dans `create-checkout-session/index.ts`, ligne 113 :

```typescript
unit_amount: Math.round(part.price * 100), // Price in cents (HT)
```

Les prix de la base de données sont stockés en HT, mais ils sont envoyés tels quels à Stripe sans appliquer la TVA de 20%.

## Solution

Modifier la fonction `create-checkout-session` pour envoyer les prix TTC à Stripe :

1. **Produits** : Multiplier chaque prix par 1.20 (TVA 20%)
2. **Livraison** : Reste inchangée (déjà TTC)

## Fichier à Modifier

**`supabase/functions/create-checkout-session/index.ts`**

### Changement 1 - Prix des produits (ligne 113)

```typescript
// AVANT
unit_amount: Math.round(part.price * 100), // Price in cents (HT)

// APRÈS
unit_amount: Math.round(part.price * (1 + TVA_RATE) * 100), // Price in cents (TTC with 20% VAT)
```

### Changement 2 - Ajouter un commentaire explicatif (ligne 106-116)

```typescript
// Create Stripe line item with price_data (dynamic pricing)
// IMPORTANT: Prices are sent TTC (including 20% VAT) to Stripe
lineItems.push({
  price_data: {
    currency: "eur",
    product_data: {
      name: part.name,
      images: part.image_url ? [part.image_url] : [],
    },
    unit_amount: Math.round(part.price * (1 + TVA_RATE) * 100), // Price TTC in cents
  },
  quantity: cartItem.quantity,
});
```

## Vérification Post-Déploiement

Après le déploiement, pour la commande test :

| Article | Prix HT | Prix TTC (×1.20) |
|---------|---------|------------------|
| Pneu 10×2.75-6.5 | 35.00 € | 42.00 € |
| Chambre à Air | 12.00 € | 14.40 € |
| Disque de Frein | 15.00 € | 18.00 € |
| **Sous-total** | 62.00 € | **74.40 €** |
| Livraison Standard | — | 4.90 € |
| **Total Stripe** | — | **79.30 €** ✓ |

## Impact

- **Avant** : Client paie 66.90 € (perte de 12.40 € de TVA par commande)
- **Après** : Client paie 79.30 € (montant correct TTC)

## Déploiement

La fonction Edge sera automatiquement redéployée après modification.

