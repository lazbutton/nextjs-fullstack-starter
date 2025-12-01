# Conventions du Projet

> **Note** : Ce fichier est caché de la documentation publique (préfixe `_`) mais reste accessible pour les développeurs et l'IA assistant.

## Git & Code

- **Branche main** : Vérifier qu'elle est à jour avant chaque modification (`git pull origin main` ou `git fetch && git rebase origin/main`)
- **Commits** : Messages en anglais, clairs et descriptifs
- **Comments** : Tous les commentaires en anglais
- **TypeScript** : Mode strict activé
- **Build** : Vérifier avec `npm run build` régulièrement

## Base de Données

### Migrations

- **Fichiers** : `/database/migrations/XXX_description.sql`
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

## SEO (Search Engine Optimization)

**Important** : Le SEO doit être pris en compte dans toutes les nouvelles fonctionnalités et pages créées.

### Metadata

- **Toutes les pages** : Définir `metadata` ou `generateMetadata` avec :
  - `title` : Titre unique et descriptif (max 60 caractères)
  - `description` : Description unique et pertinente (150-160 caractères)
  - `keywords` : Mots-clés pertinents (optionnel mais recommandé)
  - `openGraph` : Titre, description, image, type, URL
  - `twitter` : Cards pour Twitter (si applicable)
- **Titre du layout** : Utiliser un template (`"%s | Site Name"`) pour la cohérence
- **Locale** : Mettre à jour `openGraph.locale` selon la langue actuelle

### Images

- **Optimisation** : Toujours utiliser `next/image` avec :
  - Formats modernes (AVIF, WebP en priorité)
  - Tailles adaptées (`sizes` prop)
  - Lazy loading par défaut
  - Alt text descriptif et pertinent
- **Open Graph images** : Fournir une image OG pour chaque page importante (1200x630px recommandé)
- **Favicons** : Maintenir les favicons à jour dans `/public`

### Structured Data (JSON-LD)

- **Pages importantes** : Ajouter des données structurées JSON-LD :
  - `WebSite` : Pour la page d'accueil
  - `Article` : Pour les articles/blogs
  - `BreadcrumbList` : Pour la navigation hiérarchique
  - `Organization` : Pour les informations de l'organisation
- **Validation** : Tester avec [Google Rich Results Test](https://search.google.com/test/rich-results)

### URLs & Routing

- **URLs propres** : Utiliser des URLs descriptives et SEO-friendly
  - `/blog/my-article-title` plutôt que `/blog/123`
  - Pas de paramètres d'URL inutiles
- **Slugs** : Générer des slugs depuis les titres (lowercase, tirets)
- **Canonical URLs** : Définir les URLs canoniques pour éviter le contenu dupliqué

### Performance

- **Core Web Vitals** : Optimiser pour LCP, FID, CLS
- **Compression** : Activer la compression (déjà configuré dans Next.js)
- **Code splitting** : Utiliser le lazy loading des composants
- **Images** : Optimiser les images (formats modernes, tailles appropriées)
- **Fonts** : Optimiser le chargement des polices (next/font)

### Content

- **Hierarchy** : Utiliser une hiérarchie de titres correcte (h1 → h2 → h3)
- **Un seul h1** : Par page
- **Sémantique HTML** : Utiliser les balises HTML5 appropriées (`<article>`, `<section>`, `<nav>`, etc.)
- **Accessibilité** : Lier SEO et accessibilité (alt text, aria labels, etc.)

### Technical SEO

- **Sitemap** : Maintenir `/sitemap.xml` à jour avec toutes les pages publiques
- **Robots.txt** : Configurer correctement dans `/robots.txt`
- **Manifest** : Maintenir `/manifest.webmanifest` pour PWA
- **Security headers** : Vérifier les en-têtes de sécurité dans `next.config.ts`

### Internationalization (i18n)

- **Hreflang** : Ajouter les balises `hreflang` pour le contenu multilingue
- **Locale dans les URLs** : Si applicable, utiliser des URLs avec locale
- **Metadata par langue** : Adapter les metadata selon la langue

### Analytics & Monitoring

- **Search Console** : Configurer Google Search Console
- **Verification** : Ajouter les codes de vérification dans les metadata (Google, Bing, Yandex)
- **Structured data errors** : Surveiller les erreurs dans Search Console

### Checklist pour nouvelles pages

Lors de la création d'une nouvelle page, vérifier :
- [ ] Metadata (title, description, OG, Twitter)
- [ ] Image OG si nécessaire
- [ ] Alt text pour toutes les images
- [ ] Structured data JSON-LD si applicable
- [ ] URL SEO-friendly
- [ ] Hiérarchie de titres correcte (h1 unique)
- [ ] Mise à jour du sitemap si page publique
- [ ] Test avec Google Rich Results Test

## Traductions

- **Clés** : Modifier uniquement `en.json`
- **Autres langues** : Mises à jour manuelles

## Documentation

- **Fichiers de documentation** : Tous les fichiers de documentation (`.md`) doivent être rédigés en anglais
- **Fichiers concernés** : `README.md`, tous les fichiers dans `/docs/`, `ENV.md`, etc.
- **Commentaires dans le code** : Toujours en anglais (voir section "Traductions")
- **Masquer des fichiers** : Préfixer avec `_` ou `.` pour les exclure de la documentation (ex: `_HIDDEN.md`, `.private.md`)

## Stack & Technos

- Next.js 16 (App Router)
- TypeScript (strict)
- Neon (PostgreSQL database)
- Stack Auth (Authentication)
- shadcn/ui + Tailwind CSS
- Resend (emails)
- Server Actions

## Middleware

Le fichier `middleware.ts` est requis pour Stack Auth session management. Ignorer le warning de dépréciation Next.js 16.

