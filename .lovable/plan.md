

# Correction du domaine email dans send-order-email

## Probleme identifie

La fonction Edge `send-order-email` utilise un domaine email incorrect :
- **Actuel** : `noreply@piecesdetrot.fr`
- **Requis** : `noreply@piecestrottinettes.fr`

Cela correspond a l'erreur vue dans les logs :
> "The piecesdetrot.fr domain is not verified"

## Modification a effectuer

**Fichier** : `supabase/functions/send-order-email/index.ts`

**Ligne 252** - Changer :
```typescript
from: "Pièces de Trot <noreply@piecesdetrot.fr>",
```

**Par** :
```typescript
from: "Pièces de Trot <noreply@piecestrottinettes.fr>",
```

## Deploiement

La fonction sera automatiquement redeployee par Lovable Cloud apres la modification du code. Aucune action manuelle n'est requise.

## Prerequis cote Resend

Assurez-vous que le domaine `piecestrottinettes.fr` est bien verifie dans votre compte Resend :
1. Allez sur https://resend.com/domains
2. Verifiez que `piecestrottinettes.fr` apparait avec le statut "Verified"
3. Si ce n'est pas le cas, ajoutez les enregistrements DNS requis

## Test apres correction

Une fois deploye, nous pourrons tester l'envoi d'un email de confirmation pour valider que tout fonctionne correctement.

