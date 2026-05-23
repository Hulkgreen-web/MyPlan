# Guide de Développement - Web Skeleton

Ce projet est un monorepo moderne utilisant **pnpm**, **Turbo**, **Fastify**, **MikroORM** et **React**.

## 🚀 Démarrage Rapide

### Prérequis
- Node.js (v18+)
- pnpm (`npm install -g pnpm`)
- Docker & Docker Compose

### 1. Lancer l'infrastructure
Les services de base (Base de données, Cache) doivent être lancés via Docker :
```bash
docker-compose up -d db redis
```

### 2. Installer et Lancer
```bash
pnpm install
pnpm dev
```
- **Frontend** : `http://localhost:3000`
- **Backend** : `http://localhost:3001`

---

## 🏗️ Structure du Monorepo

- `apps/api` : Backend Fastify avec MikroORM (PostgreSQL).
- `apps/web` : Frontend React avec Vite et TailwindCSS.
- `packages/shared` : Schémas Zod, types et constantes partagés entre le Front et le Back.

---

## 🛠️ Ajouter une nouvelle fonctionnalité (Étape par étape)

Imaginons que vous vouliez ajouter une entité **"User"**.

### 1. Définir le schéma dans `shared`
Modifiez `packages/shared/src/index.ts` (ou créez un nouveau fichier dans `shared/src`) :
```typescript
// packages/shared/src/user.ts
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string()
});

export const CreateUserSchema = UserSchema.omit({ id: true });
```
N'oubliez pas d'exporter votre nouveau fichier dans `packages/shared/src/index.ts`.

### 2. Créer l'entité dans l'API
Créez `apps/api/src/entities/User.ts`. 
**Important** : Utilisez des types explicites dans les décorateurs pour la compatibilité avec `tsx` :
```typescript
@Entity()
export class User {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @Property({ type: 'string', unique: true })
  email!: string;

  @Property({ type: 'string' })
  name!: string;
}
```
Ajoutez cette entité dans `apps/api/mikro-orm.config.ts`.

### 3. Ajouter une route dans l'API
Dans `apps/api/src/index.ts` :
```typescript
import { CreateUserSchema } from 'shared';

fastify.post('/users', async (request) => {
  const data = CreateUserSchema.parse(request.body);
  const user = new User(data);
  await em.persistAndFlush(user);
  return user;
});
```

### 4. Utiliser dans le Frontend
Grâce au monorepo, vous importez directement les types :
```typescript
import { CreateUser } from 'shared';

const user: CreateUser = { email: 'test@test.com', name: 'John' };
```

---

## ⚙️ Configuration Technique Importante

### ESM & Décorateurs
Le projet utilise le mode **ESM** (`"type": "module"`). Pour le développement, nous utilisons `tsx` au lieu de `ts-node` pour une meilleure gestion de l'ESM et de la rapidité.

Comme `tsx` utilise `esbuild` en interne, il ne supporte pas `emitDecoratorMetadata`. Vous devez donc **toujours spécifier le type explicitement** dans les décorateurs MikroORM :
```typescript
// ✅ CORRECT
@Property({ type: 'string' })
name!: string;

// ❌ INCORRECT (ne fonctionnera pas au runtime avec tsx)
@Property()
name!: string;
```

### Base de données
L'API synchronise automatiquement le schéma en développement via :
```typescript
await orm.getSchemaGenerator().updateSchema();
```
En production, il est recommandé d'utiliser les migrations MikroORM.

### Variables d'environnement
- `DATABASE_URL` (API)
- `VITE_API_URL` (Web)
- `JWT_SECRET` (API) : Clé secrète pour signer les tokens.

---

## 🔐 Authentification

Le projet inclut un système d'authentification complet basé sur les JWT (JSON Web Tokens).

### Fonctionnement
1. **Access Token** : Jeton à courte durée de vie (15 min) renvoyé en JSON. Utilisé pour authentifier chaque requête via le header `Authorization: Bearer <token>`.
2. **Refresh Token** : Jeton à longue durée de vie (7 jours) stocké dans un cookie **HttpOnly**. Utilisé pour obtenir un nouvel Access Token sans que l'utilisateur n'ait à se reconnecter.

### Sécurité
- **Cookies HttpOnly** : Le Refresh Token est inaccessible via JavaScript (protection contre XSS).
- **Hachage Bcrypt** : Les mots de passe sont hachés avant d'être stockés.
- **Révocation** : Les Refresh Tokens sont stockés en base de données, permettant de déconnecter un utilisateur à distance en supprimant son token.

### Routes d'Authentification
- `POST /auth/register` : Créer un compte.
- `POST /auth/login` : Se connecter (reçoit l'Access Token + Cookie Refresh).
- `POST /auth/refresh` : Obtenir un nouvel Access Token via le cookie.
- `POST /auth/logout` : Supprimer le Refresh Token et vider le cookie.
- `GET /auth/me` : Récupérer les infos de l'utilisateur connecté (Route protégée).

### Exemple de protection de route
```typescript
fastify.get('/mon-profil', async (request, reply) => {
  await request.jwtVerify(); // Vérifie l'Access Token
  const user = request.user; // Contient les données du token (sub, email)
});
```

