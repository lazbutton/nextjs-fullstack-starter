# Conventions du Projet

## Git & Code

- **Branche main** : Vérifier qu'elle est à jour avant chaque modification (`git pull origin main` ou `git fetch && git rebase origin/main`)
- **Commits** : Messages en anglais, clairs et descriptifs
- **Comments** : Tous les commentaires en anglais
- **TypeScript** : Mode strict activé
- **Build** : Vérifier avec `npm run build` régulièrement

## Base de Données

### Migrations

- **Fichiers** : `/supabase/migrations/XXX_description.sql`
- **Non-destructif** : Utiliser `IF EXISTS`, `IF NOT EXISTS`
- **Ordre** : Appliquer séquentiellement (001, 002, etc.)
- **Documentation** : Commenter chaque migration

### Performance

- **Index** : Créer sur colonnes fréquemment requêtées
- **Queries** : Toujours utiliser LIMIT, sélectionner colonnes nécessaires
- **WHERE clauses** : Utiliser colonnes indexées
- **Monitoring** : Logger les requêtes lentes (>100ms)

### Migrations Destructives

Si absolument nécessaire :
1. **Backup** : Exporter les données avant
2. **Documentation** : Expliquer pourquoi et comment restaurer
3. **Reimport script** : Fournir un script de restauration

## Code

### Nommage

- Variables/fonctions : `camelCase`
- Composants/types : `PascalCase`
- Fichiers : `kebab-case.tsx`
- Constantes : `UPPER_SNAKE_CASE`
- Booléens : préfixer avec `is`, `has`, `should`, `can`

### Organisation

- **DRY** : Éviter les répétitions
- **Single Responsibility** : Une fonction = une responsabilité
- **Fichiers** : < 300 lignes (séparer si plus)
- **Fonctions** : < 50 lignes (extraire si plus)
- **Composants** : < 200 lignes (découper si plus)

### Structure

```
/lib          # Utils par fonctionnalité (auth, database, emails)
/components   # Composants par fonctionnalité
/hooks        # Hooks customs
/types        # Définitions TypeScript
```

## UI/UX

- **Boutons** : Toujours `cursor: pointer`
- **Images** : Utiliser `next/image`
- **Server Components** : Par défaut, Client Components seulement si nécessaire

## Traductions

- **Clés** : Modifier uniquement `en.json`
- **Autres langues** : Mises à jour manuelles

## Documentation

- **Fichiers de documentation** : Tous les fichiers de documentation (`.md`) doivent être rédigés en anglais
- **Fichiers concernés** : `README.md`, tous les fichiers dans `/docs/`, `ENV.md`, etc.
- **Commentaires dans le code** : Toujours en anglais (voir section "Traductions")

## Stack & Technos

- Next.js 16 (App Router)
- TypeScript (strict)
- Supabase (PostgreSQL + Auth)
- shadcn/ui + Tailwind CSS
- Resend (emails)
- Server Actions

## Middleware

Le fichier `middleware.ts` est requis pour Supabase SSR. Ignorer le warning de dépréciation Next.js 16.
