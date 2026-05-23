# Monorepo Fullstack (Turborepo + Docker)

## Stack
- **Gestion Monorepo :** Turborepo, pnpm
- **Frontend :** React (Vite), TypeScript, Tailwind CSS
- **Backend :** Fastify, TypeScript, MikroORM (PostgreSQL)
- **Validation :** Zod (Partagé)
- **Infrastructure :** Docker, Docker Compose, PostgreSQL, Redis

## Arborescence

```text
.
├── apps/
│   ├── api/                 # Fastify Backend
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── src/
│   │       └── entities/
│   │           └── Todo.ts  # MikroORM Entity
│   └── web/                 # React Frontend
│       ├── Dockerfile
│       ├── nginx.conf
│       ├── package.json
│       └── src/
├── packages/
│   ├── config-eslint/       # (Optionnel) Configurations ESLint partagées
│   ├── config-typescript/   # (Optionnel) Configurations TS partagées
│   └── shared/              # Types et Schémas Zod partagés
│       ├── package.json
│       └── src/
│           └── todos.ts     # Zod schemas
├── docker-compose.yml
├── pnpm-workspace.yaml
├── package.json
└── turbo.json
```

## Lancement Rapide avec Docker

Une seule commande pour lancer toute la stack (Base de données, Redis, API, Frontend via des builds optimisés multi-stage) :

```bash
docker-compose up --build
```

- **Frontend (React)** : Accessible sur [http://localhost:3000](http://localhost:3000)
- **Backend (API)** : Accessible sur [http://localhost:3001](http://localhost:3001)
- **Base de données (PostgreSQL)** : Port 5432
- **Redis** : Port 6379

## Développement Local

Si vous souhaitez faire tourner le projet sans Docker pour le développement :

1. Installez les dépendances :
   ```bash
   pnpm install
   ```
2. Lancez les bases de données (si vous n'avez pas de DB locale, utilisez docker-compose) :
   ```bash
   docker-compose up db redis -d
   ```
3. Lancez le mode développement via Turborepo :
   ```bash
   pnpm dev
   ```
