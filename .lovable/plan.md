
# Plan d'Implementation du Webhook Stripe

## Objectif

Ajouter un webhook Stripe pour gérer les evenements de paiement de maniere asynchrone et securisee. Cela permet de capturer les paiements meme si l'utilisateur ferme son navigateur avant d'arriver sur la page de succes.

## Pourquoi un Webhook ?

Le flux actuel repose sur la page `/payment-success` pour verifier le paiement. Probleme : si l'utilisateur ferme son navigateur apres avoir paye, la commande reste en `awaiting_payment` indefiniment.

Le webhook resout ce probleme en recevant directement les notifications de Stripe, independamment du comportement de l'utilisateur.

## Architecture

```text
FLUX ACTUEL (conserve)
┌─────────────────────────────────────────────────────────────┐
│  User ─> Stripe Checkout ─> /payment-success ─> verify-payment
│                                                    │
│                                              Update order
│                                              Send email
└─────────────────────────────────────────────────────────────┘

NOUVEAU FLUX WEBHOOK (backup securise)
┌─────────────────────────────────────────────────────────────┐
│  Stripe ─> POST /stripe-webhook ─> Verify signature
│                                          │
│                     ┌────────────────────┴────────────────┐
│                     │                                     │
│              checkout.session.completed         payment_intent.succeeded
│                     │                                     │
│              Update order to "pending"          Backup verification
│              Send confirmation email
└─────────────────────────────────────────────────────────────┘
```

## Evenements Stripe a Gerer

| Evenement | Action |
|-----------|--------|
| `checkout.session.completed` | Marquer la commande comme payee, envoyer l'email de confirmation |
| `payment_intent.payment_failed` | Logger l'echec pour le suivi admin (optionnel) |

## Implementation Technique

### 1. Stocker le Webhook Secret

**Secret a ajouter** : `STRIPE_WEBHOOK_SECRET`
**Valeur** : `whsec_3FpkWiRA87uLXCl4bVWg9NsxkCyhyguG`

Ce secret permet de verifier que les requetes proviennent bien de Stripe et non d'un attaquant.

### 2. Creer l'Edge Function `stripe-webhook`

**Chemin** : `supabase/functions/stripe-webhook/index.ts`

**Responsabilites** :
- Recevoir les events POST de Stripe
- Verifier la signature avec le webhook secret
- Parser l'evenement
- Pour `checkout.session.completed` :
  - Recuperer l'order_id depuis les metadata
  - Verifier que la commande n'est pas deja payee (idempotence)
  - Mettre a jour le statut vers `pending`
  - Stocker le `payment_intent_id` et `paid_at`
  - Declencher l'envoi d'email

**Code cle** :
```typescript
// Verification de signature Stripe
const signature = req.headers.get("stripe-signature");
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
const event = await stripe.webhooks.constructEventAsync(
  body,
  signature,
  webhookSecret
);

// Idempotence : ne pas retraiter une commande deja payee
if (order.status !== "awaiting_payment") {
  return new Response(JSON.stringify({ received: true, skipped: true }));
}
```

### 3. Configurer l'Edge Function

**Fichier** : `supabase/config.toml`

```toml
[functions.stripe-webhook]
verify_jwt = false  # Stripe envoie ses propres tokens, pas de JWT Supabase
```

### 4. Configurer le Webhook dans Stripe Dashboard

**URL du webhook** : 
`https://kqsxscjtlipregkrmucg.supabase.co/functions/v1/stripe-webhook`

**Evenements a ecouter** :
- `checkout.session.completed`
- `payment_intent.payment_failed` (optionnel)

## Securite

| Risque | Protection |
|--------|------------|
| Requete falsifiee | Verification de signature avec `stripe-signature` header |
| Replay attack | Stripe inclut un timestamp dans la signature |
| Double traitement | Verification du statut actuel avant mise a jour (idempotence) |
| Donnees sensibles | Aucune donnee de carte n'est transmise, seulement les IDs |

## Fichiers a Creer/Modifier

| Fichier | Action |
|---------|--------|
| Secret `STRIPE_WEBHOOK_SECRET` | Ajouter via outil Supabase |
| `supabase/functions/stripe-webhook/index.ts` | Creer |
| `supabase/config.toml` | Ajouter config fonction |

## Test

1. Utiliser Stripe CLI pour tester localement :
   ```bash
   stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook
   ```

2. Declencher un paiement test et verifier :
   - La commande passe bien en `pending`
   - L'email est envoye
   - Le `paid_at` et `stripe_payment_intent_id` sont remplis

## Avantages de cette Implementation

- **Fiabilite** : Les paiements sont captures meme si le navigateur est ferme
- **Idempotence** : Le webhook et la page de succes peuvent tous deux traiter le paiement sans conflit
- **Securite** : Signature cryptographique pour authentifier Stripe
- **Simplicite** : Reutilise la logique existante de `send-order-email`
