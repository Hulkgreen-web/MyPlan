# Base stage
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Builder stage
FROM base AS builder
WORKDIR /app
RUN pnpm install -g turbo
COPY . .
# Prune the workspace for the web app
RUN turbo prune --scope=web --docker

# Installer stage
FROM base AS installer
WORKDIR /app

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .
RUN pnpm turbo run build --filter=web...

# Runner stage (Nginx)
FROM nginx:alpine AS runner
# Copy static assets from builder stage
COPY --from=installer /app/apps/web/dist /usr/share/nginx/html
# Add default nginx config
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
