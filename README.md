# MyPlan — Monorepo Fullstack de Gestion Financière

MyPlan est une application moderne de gestion de budget et de finances personnelles, construite sous forme de monorepo avec **pnpm workspaces**, **Turborepo**, **Fastify**, **React**, **PostgreSQL** et **Redis**.

---

## État d'avancement des fonctionnalités

### Complètement développées (100% Fonctionnel)

- **Authentification & Gestion des sessions (Fullstack) :**
  - Inscription (`POST /auth/register`) avec hachage de mot de passe Bcrypt et validation Zod.
  - Connexion (`POST /auth/login`) délivrant un Access Token JWT en mémoire (15 min) et un Refresh Token (7 jours) stocké en cookie `HttpOnly` sécurisé et persisté en BDD (`RefreshToken`).
  - Rafraîchissement automatique de session (`POST /auth/refresh`) avec intercepteur frontend transparent lors des retours 401.
  - Déconnexion (`POST /auth/logout`) avec révocation en base et nettoyage du cookie.
  - Récupération du profil authentifié (`GET /auth/me`).
  - Interface d'authentification (`/login`, `/register`) avec formulaires, validation et gestion des erreurs.
  - Protection des routes côté client via `ProtectedRoute` et redirection automatique.
- **Gestion des Transactions (Fullstack) :**
  - Récupération en temps réel des transactions via l'API (`GET /transactions`) filtrées par utilisateur connecté.
  - Création de transactions (`POST /transactions`) avec sélection de type (dépense / revenu), nom, montant et date.
  - Page dédiée aux transactions (`/transactions`) avec système de filtrage par onglets (Toutes, Revenus, Dépenses).
  - Affichage des dernières transactions sur le tableau de bord (`/`).
  - Calcul et affichage dynamique des montants avec badge coloré DaisyUI (vert pour les revenus, rouge pour les dépenses).
- **Clean Architecture Frontend (`apps/web`) :**
  - Organisation stricte en couches :
    - `domain/` : Value Objects (validation et immutabilité), Entités métier, Ports de Repositories, Cas d'usage unitaires (`usecases`).
    - `data/` : Clients API HTTP (`apiFetch`), Mappers (DTO ↔ Entités), Implémentations concrètes des Repositories.
    - `presentation/` : Découpage par sous-dossiers thématiques (`transactions`, `auth`) pour les composants, hooks et pages.
  - Inversion de dépendances via [`CompositionRoot.tsx`](apps/web/src/CompositionRoot.tsx) fournissant les instances de Use Cases via contexte React (`useTransactionUseCases`, `useAuthUseCases`).
  - Séparation stricte Affichage / Logique : les composants TSX sont purement déclaratifs, toute la logique applicative est déléguée à des custom hooks (Hook-as-ViewModel).
  - Path aliases configurés (`@/`, `@domain/`, `@data/`, `@presentation/`) sous Vite et TypeScript.
  - Layout global persistant (`AppLayout`) avec barre latérale (`Sidebar`) définie au niveau du routeur.
- **Architecture Fastify & Validation des Schémas (Backend) :**
  - Fastify 4 avec `fastify-type-provider-zod` (`validatorCompiler` et `serializerCompiler`).
  - Chaque route est isolée dans son propre fichier (`*.route.ts`).
  - Déclaration obligatoire des schémas d'entrée (`body`, `params`) et de sortie (`response`) pour filtrer les données sensibles (comme les mots de passe) et optimiser la sérialisation.
  - Gestion centralisée des erreurs de validation (HTTP 400 automatique).
- **Contrat de domaine partagé (`packages/shared`) :**
  - Schémas Zod et types TypeScript unifiés entre l'API et le Frontend.
- **Personnalisation & Internationalisation (Frontend) :**
  - Support multilingue Français / Anglais (`react-i18next`) avec bascule instantanée.
  - Support des thèmes DaisyUI avec persistance dans le `localStorage`.
- **Infrastructure & Tests :**
  - Environnement Docker Compose (PostgreSQL 16, Redis 7).
  - Suite de tests d'intégration backend avec Vitest (mocks MikroORM).

---

### Partiellement développées (À moitié développé / En cours)

- **Gestion des Transactions (Backend restant) :**
  - *Backend (Fait) :* Entité MikroORM `Transaction`, routes API `GET /transactions`, `POST /transactions`, `PATCH /transactions/:id`.
  - *Backend (Manquant) :* Pas encore d'endpoint `DELETE /transactions/:id`.
- **Gestion du Budget :**
  - *Frontend (Fait en local) :* Composant `BudgetSection` avec affichage du budget restant et modal pour incrémenter le montant, mais basé sur un simple état React local (`useState`).
  - *Backend (Manquant) :* Aucune entité ni table `Budget` en base de données, pas de route API pour définir ou persister un budget mensuel.
- **Profil Utilisateur :**
  - *Frontend (Fait) :* Composant `Profile` affichant les informations de l'utilisateur connecté (nom, email, ID, avatar avec initiales, bouton déconnexion, copie de l'identifiant).
  - *Manquant :* Le bouton "Changer de mot de passe" n'est pas branché et aucun endpoint backend de modification du profil ou du mot de passe n'existe.
- **Liste des Utilisateurs (`/users`) :**
  - Route `GET /users` opérationnelle sur l'API, mais non exploitée dans l'interface.

---

### Non développées du tout (Planifié / À implémenter)

- **Vue détaillée des Transactions (`/transactions`) :**
  - L'onglet "Transactions" de la barre latérale affiche actuellement un placeholder *"Bientôt disponible"*.
  - Pas d'historique paginé, pas de recherche textuelle, pas de tri par date/montant, ni de filtre revenus/dépenses.
- **Module d'Épargne & Objectifs financiers (`/savings`) :**
  - L'onglet "Épargne" affiche un placeholder *"Bientôt disponible"*.
  - Aucune logique backend (entités BDD, calculs d'intérêts ou tirelires) ni interface utilisateur.
- **Catégorisation des Transactions :**
  - Pas de système de catégories (Alimentation, Logement, Loisirs, etc.) ni d'icônes/couleurs associées.
- **Statistiques & Graphiques :**
  - Pas de tableau de bord analytique (diagrammes de répartition des dépenses, évolution mensuelle).
- **Transactions Récurrentes / Abonnements :**
  - Pas de gestion des charges fixes récurrentes automatiques (loyer, abonnements, salaires).
- **Import / Export de données :**
  - Pas d'import de relevés bancaires (CSV, OFX) ni d'export (PDF, Excel).
- **Récupération de mot de passe :**
  - Pas de flux de réinitialisation de mot de passe par email.

---

## Stack Technique

- **Monorepo & Outillage :** pnpm (avec catalog), Turborepo, TypeScript.
- **Backend (`apps/api`) :** Fastify v4, `fastify-type-provider-zod`, MikroORM v7 (PostgreSQL), `@fastify/jwt`, `@fastify/cookie`, `bcrypt`, Vitest.
- **Frontend (`apps/web`) :** React 18, Vite 8, React Router 7, Tailwind CSS 3, DaisyUI 4, `react-i18next`.
- **Partagé (`packages/shared`) :** Schémas Zod, types déduits et utilitaires métier.
- **Infrastructure locale :** Docker Compose (PostgreSQL 16, Redis 7).

---

## Arborescence du Projet

```text
.
├── apps/
│   ├── api/                     # Backend Fastify
│   │   ├── src/
│   │   │   ├── entities/        # Entités MikroORM (User, Transaction, RefreshToken)
│   │   │   ├── routes/          # Routes Fastify modulaires par fichier (*.route.ts)
│   │   │   │   ├── auth/        # /auth (login, register, refresh, logout, me)
│   │   │   │   ├── transactions/# /transactions (list, create, update)
│   │   │   │   └── users/       # /users (list)
│   │   │   ├── app.ts           # Builder de l'application & plugins Fastify
│   │   │   ├── index.ts         # Point d'entrée serveur (port 3001)
│   │   │   └── mikro-orm.config.ts
│   │   └── test/                # Tests d'intégration Vitest
│   │
│   └── web/                     # Frontend React (Vite)
│       └── src/
│           ├── CompositionRoot.tsx # Injection des dépendances & Context Providers
│           ├── domain/          # Couche Métier (Value Objects, Models, Ports, Use Cases)
│           │   ├── auth/
│           │   └── transactions/
│           ├── data/            # Couche Données (API clients, Mappers, Repositories)
│           │   ├── auth/
│           │   └── transactions/
│           ├── presentation/    # Couche Présentation (Découplée via hooks/ViewModels)
│           │   ├── components/  # Composants UI (auth, transactions, layout, logo)
│           │   ├── hooks/       # ViewModels / Logique métier découplée
│           │   ├── pages/       # Vues routées (Home, auth, transactions, Savings)
│           │   └── i18n/        # Configuration & dictionnaires i18n FR/EN
│           ├── AuthContext.tsx  # Contexte React Auth orchestré par les Use Cases
│           └── api.ts           # Client HTTP fetch avec refresh token transparent
│
├── packages/
│   └── shared/                  # Schémas Zod et types partagés
│       └── src/
│           ├── auth.ts
│           ├── transactions.ts
│           └── users.ts
│
├── docker-compose.yml           # Infrastructure locale (PostgreSQL + Redis)
├── pnpm-workspace.yaml          # Définition des workspaces et catalogue de versions
├── GEMINI.md                    # Contexte technique d'architecture pour agents IA
└── turbo.json
```

---

## Démarrage Rapide

### 1. Démarrer les bases de données (Docker)

```bash
docker-compose up -d db redis
```

### 2. Installer les dépendances

```bash
pnpm install
```

### 3. Lancer l'environnement de développement

```bash
pnpm dev
```

- **Frontend** : [http://localhost:3000](http://localhost:3000)
- **Backend API** : [http://localhost:3001](http://localhost:3001)

### 4. Lancer les tests

```bash
pnpm --filter api test
```
