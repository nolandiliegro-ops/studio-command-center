
# Correction du Mapping des Statuts de Paiement

## Probleme Identifie

Les Edge Functions `stripe-webhook` et `verify-payment` mettent le statut de commande a `"pending"` apres un paiement reussi. Cependant, dans l'interface admin, `"pending"` est affiche comme "En attente" (couleur orange), ce qui prete a confusion.

La capture d'ecran montre que :
- Le webhook retourne `processed: true` avec le bon `orderId`
- La base de donnees confirme que la commande a bien `paid_at` rempli et `stripe_payment_intent_id` stocke
- Mais l'admin affiche "En attente" au lieu de "Paye"

## Cause Racine

Incoherence entre :
1. **Edge Functions** : utilisent `status: "pending"` pour signifier "paye, en attente d'expedition"
2. **Admin UI** : interprete `"pending"` comme "En attente" (non paye) et attend `"paid"` pour afficher "Paye"

## Solution Recommandee

Modifier les Edge Functions pour utiliser `status: "paid"` au lieu de `status: "pending"` apres un paiement reussi. C'est la solution la plus coherente car :
- Elle respecte le mapping UI existant
- Elle utilise un statut explicite (`paid`) pour indiquer le paiement
- Le flux devient : `awaiting_payment` → `paid` → `processing` → `shipped` → `delivered`

## Fichiers a Modifier

### 1. Edge Function `stripe-webhook`

**Fichier** : `supabase/functions/stripe-webhook/index.ts`

**Modification** : Ligne 94

```typescript
// AVANT
status: "pending",

// APRES  
status: "paid",
```

### 2. Edge Function `verify-payment`

**Fichier** : `supabase/functions/verify-payment/index.ts`

**Modifications** :

Ligne 62 - Condition de verification :
```typescript
// AVANT
if (order.status === "paid" || order.status === "pending") {

// APRES
if (order.status === "paid") {
```

Ligne 95 - Mise a jour du statut :
```typescript
// AVANT
status: "pending", // pending means paid but not shipped

// APRES
status: "paid", // Payment confirmed
```

Ligne 150 - Reponse :
```typescript
// AVANT
status: "pending",

// APRES
status: "paid",
```

### 3. Aucun Changement Necessaire

- `OrdersManager.tsx` : Le mapping des statuts est deja correct
- Base de donnees : Aucune migration necessaire

## Flux Apres Correction

```text
awaiting_payment  ──(Stripe paye)──>  paid  ──(Admin)──>  processing  ──>  shipped  ──>  delivered
      │                                 │
      │                                 └── Affiche "Paye" (vert) dans l'admin
      │
      └── Affiche "En attente de paiement" (si on l'ajoute a l'UI)
```

## Verification

Apres deploiement, la commande `PT-QDAO` passera automatiquement a "Paye" lors du prochain paiement test, ou on peut mettre a jour manuellement via l'admin.

## Section Technique

### Changements Exacts

**stripe-webhook/index.ts ligne 93-97** :
```typescript
.update({
  status: "paid",  // Changed from "pending"
  stripe_payment_intent_id: session.payment_intent as string,
  paid_at: new Date().toISOString(),
})
```

**verify-payment/index.ts ligne 94-98** :
```typescript
.update({
  status: "paid",  // Changed from "pending"
  stripe_payment_intent_id: paymentIntent?.id || null,
  paid_at: new Date().toISOString(),
})
```

### Deploiement

Les deux Edge Functions devront etre redeployees apres modification.
