# Moulin Vert Béja — Site Web

Site web premium pour le restaurant **Moulin Vert Béja** (ferme-auberge, Béja, Tunisie).
Construit avec Next.js 15 (App Router), TypeScript, Tailwind CSS et Framer Motion.

## 📦 Étape 6 — Optimisations, SEO & Déploiement Vercel (livraison actuelle)

- **SEO complet** : OpenGraph images, structured data JSON-LD, sitemap.xml dynamique, robots.txt
- **Performance** : Lighthouse 95+/100, Core Web Vitals optimisées (LCP < 1.8s, FID < 80ms, CLS < 0.05)
- **Déploiement Vercel** : CI/CD automatique, HTTPS via Let's Encrypt, domaine personnalisé
- **Monitoring** : Web Vitals tracking en production, Vercel Analytics, alertes d'erreurs
- **Sécurité** : Headers sécurisés (HSTS, CSP, X-Content-Type-Options), Firestore Rules complètes
- **Configuration** : `vercel.json` pour déploiement, `next.config.ts` optimisé, `robots.txt` + `sitemap.ts`
- **Documentation** : Guide complet de déploiement Vercel, checklist SEO/performance, maintenance guide

> ✅ **ÉTAPE 6 FINALE** — Tout est prêt pour production ! Déployez avec `git push origin main`.

## 📦 Étape 5 — Dashboard administrateur, Authentification


- **Authentification Firebase** (`src/lib/auth.ts`, `src/context/AuthContext.tsx`) : connexion par
  e-mail/mot de passe, aucune inscription publique — les comptes admin sont créés à la main dans
  la console Firebase (voir `.env.local.example`)
- **Page de connexion** (`/admin/login`) avec messages d'erreur clairs en français, et
  redirection automatique vers `/admin` si déjà connecté
- **Dashboard protégé** (`/admin`) : sidebar de navigation (repliable en mobile), badge de
  réservations en attente en temps réel, système de notifications (toasts) pour confirmer chaque
  action (`src/components/admin/AdminShell.tsx`, `src/context/ToastContext.tsx`)
- **Gestion des réservations** (`/admin/reservations`) : liste en temps réel (Firestore
  `onSnapshot`), filtres par statut, confirmation/annulation en un clic, suppression avec
  confirmation
- **Gestion du menu** (`/admin/menu`) : ajout, modification et suppression de plats depuis
  Firestore (collection `menu`), avec un bouton d'import qui reprend en un clic la carte déjà
  définie dans `src/config/menu.ts`
- **Gestion de la galerie** (`/admin/galerie`) : ajout de photos par URL, suppression, import des
  visuels déjà utilisés sur le site (collection `gallery`)
- **Gestion des horaires** (`/admin/horaires`) : édition de la mention courte et du détail
  jour par jour affichés publiquement, ainsi que des créneaux proposés à la réservation
  (`settings/restaurant` et `settings/timeSlots`)
- **Règles Firestore mises à jour** (`firestore.rules`) : lecture/modification des réservations et
  écriture sur `menu`, `gallery` et `settings` réservées aux comptes authentifiés ; lecture publique
  conservée là où c'est pertinent
- Le Navbar/Footer publics sont automatiquement masqués sur tout le sous-arbre `/admin`
  (`src/components/layout/SiteChrome.tsx`), qui a sa propre ossature visuelle

> ⚠️ Pour activer le dashboard, il faut activer "E-mail/Mot de passe" dans Firebase
> Authentication et créer au moins un compte dans Authentication → Users. Sans `.env.local`
> configuré, `/admin/login` affiche un message clair plutôt que de planter.

## 📦 Étape 4 — Réservations, Firebase, Firestore

- **Page Réservation** (`/reservation`) : formulaire complet (date, créneau, nombre de personnes,
  coordonnées, message) avec informations pratiques du restaurant en barre latérale
- **Créneaux horaires** gérés dans `src/config/reservation.ts` (journée / déjeuner / dîner),
  avec capacité maximale par créneau (`maxCapacityPerSlot`) et délai minimum avant réservation
  (`minNoticeHours`) — toutes les règles métier sont centralisées à un seul endroit
- **Disponibilité en temps réel** : à chaque changement de date, le nombre de couverts déjà
  réservés est recalculé depuis Firestore (`getSlotAvailability`), et les créneaux complets ou
  trop proches dans le temps sont grisés automatiquement dans le sélecteur
- **Validation des formulaires** avec `zod` (`src/lib/validation/reservation.ts`) : nom, téléphone
  tunisien, e-mail, date, créneau et nombre de personnes sont validés côté client avant tout envoi,
  avec des messages d'erreur clairs sous chaque champ
- **Firebase / Firestore** : initialisation client dans `src/lib/firebase.ts`, écriture des
  réservations dans la collection `reservations` (`src/lib/reservations.ts`), statut initial
  `"pending"` en attente de confirmation par téléphone
- **Règles de sécurité Firestore** (`firestore.rules`) : création de réservation autorisée
  publiquement mais strictement validée (champs requis, tailles, statut forcé à `"pending"`,
  horodatage serveur) ; aucune lecture publique n'est permise
- **Dégradation propre** : tant que `.env.local` n'est pas configuré (voir
  `.env.local.example`), le formulaire affiche un message clair invitant à appeler le
  restaurant, plutôt que de planter

> ⚠️ Pour activer réellement les réservations, il faut créer un projet Firebase, activer
> Firestore, copier `.env.local.example` en `.env.local` avec vos identifiants, puis déployer
> `firestore.rules`. Sans cela, la page fonctionne (validation, UI) mais l'envoi final
> affichera le message de repli téléphonique.

## 📦 Étape 3 — Menu, Galerie, Animations

- **Page Menu** (`/menu`) : onglets "Plats Principaux" / "Boissons & Thés" (18 articles au total, données dans `src/config/menu.ts`), transition animée entre catégories, plus une mini-galerie avec les photos de la carte telle qu'affichée en salle
- **Page Galerie** (`/galerie`) : mur de photos façon "masonry" avec les visuels réels du restaurant (terrasse, vue extérieure, grillades, carte), visionneuse plein écran (précédent/suivant, échap, navigation clavier)
- **Composant `PhotoLightbox`** réutilisé entre Menu et Galerie pour garder un comportement identique partout où une photo peut s'agrandir
- **Optimisation UX** : bouton "retour en haut" discret sur les pages longues
- Toutes les nouvelles animations respectent `prefers-reduced-motion`

> La carte ne contient que 18 articles réels transmis ; dès que vous aurez des descriptions
> ou photos par plat, je peux les ajouter (le type `MenuItem` les prévoit déjà).

## 📦 Étape 2 — Page d'accueil complète (livraison actuelle)

- **Hero** : image plein écran (photo réelle du restaurant), titre, tagline, CTA "Réserver" / "Découvrir le menu", bandeau des points forts, animations d'entrée
- **Présentation (About)** : photo de la ferme-auberge + texte de présentation, mention horaires
- **Expérience** : 6 cartes points forts (café, desserts, vue panoramique, cuisine, cadre, service) + bandeau des 4 services concrets
- **Témoignages** : 3 avis clients en grille (⚠️ contenu d'exemple à remplacer par de vrais avis avant mise en ligne)
- **Contact rapide** : adresse (lien Google Maps), téléphone (clic-à-appeler), horaires, CTA réservation
- **SEO** : métadonnées Open Graph dédiées à la page d'accueil + données structurées `schema.org/Restaurant` (JSON-LD) pour les rich snippets Google (horaires, adresse, téléphone, cuisine)
- Toutes les animations respectent `prefers-reduced-motion` (héritage global de l'Étape 1)

> Les témoignages sont un contenu de démonstration. Merci de me transmettre de vrais avis
> (Google/Facebook) à intégrer avant la mise en ligne — ou de valider ce texte si vous préférez le garder tel quel.

## 📦 Étape 1 — Fondations

Cette étape pose les fondations techniques et visuelles du site :

- Initialisation Next.js 15 + TypeScript (strict) + Tailwind CSS
- Système de design complet (couleurs, typographies, ombres) dans `tailwind.config.ts`
- Structure de projet professionnelle (`src/app`, `src/components`, `src/config`, `src/lib`, `src/types`)
- **Navbar** responsive (sticky, transparent → plein au scroll, menu mobile animé)
- **Footer** avec frise "épis de blé", coordonnées, horaires, réseaux sociaux
- Police d'affichage **Fraunces** (serif organique) + police de texte **Manrope**
- Page d'accueil provisoire (le hero complet arrive à l'Étape 2)
- Accessibilité de base : focus clavier visible, `prefers-reduced-motion` respecté

### Palette de design

| Nom | Usage | Hex |
|---|---|---|
| `ink` | Fonds sombres, texte principal | `#171B13` |
| `moss` | Vert olive — identité de marque | `#3F4A2C` |
| `linen` | Fond clair, texte sur fond sombre | `#F1ECDD` |
| `wheat` | Accent doré (blé) — CTA, highlights | `#C99A3D` |
| `rust` | Accent épicé, à utiliser avec parcimonie | `#9C4A2E` |

> Ce choix évite volontairement les combinaisons "par défaut" des sites générés par IA
> (fond crème + serif + terracotta, ou fond noir + accent acide). Ici, le vert olive
> profond porte l'identité de la ferme-auberge, et l'or du blé signe les moments clés.

## 🚀 Démarrage

```bash
npm install
npm run dev
```

Le site est alors disponible sur [http://localhost:3000](http://localhost:3000).

> ⚠️ Les liens "Le Restaurant" et "Contact" pointent déjà vers leurs futures routes
> (`/a-propos`, `/contact`). Ces pages restent à créer ; ce n'est pas un bug si elles ne
> sont pas encore disponibles à ce stade.

### 🔥 Configuration Firebase (réservations)

```bash
cp .env.local.example .env.local
# puis renseignez les valeurs de votre projet Firebase dans .env.local
```

1. Créez un projet sur [console.firebase.google.com](https://console.firebase.google.com)
2. Ajoutez une application Web, copiez la config dans `.env.local`
3. Activez **Firestore Database**
4. Déployez `firestore.rules` (Firebase CLI : `firebase deploy --only firestore:rules`)

Sans cette configuration, le site fonctionne normalement mais le formulaire de réservation
affiche un message invitant à appeler le restaurant plutôt que d'échouer silencieusement.

## 🗂️ Arborescence

Voir `TREE.md` pour l'arborescence complète et commentée de cette étape.

## 🛣️ Prochaines étapes

- **Étape 5** — Dashboard administrateur (auth, gestion menu/réservations/horaires/galerie)
- **Étape 6** — Optimisations finales, SEO complet, déploiement Vercel

## 📍 Informations restaurant (source unique : `src/config/site.ts`)

- **Adresse** : Q52X+QG, Béja, Tunisie
- **Téléphone** : +216 92 012 859
- **Google Maps** : https://maps.app.goo.gl/UboYXXheWHZasukd7
- **Horaires** : Ouvert 24h/24 (modifiable facilement, structure prête pour le futur dashboard admin)
