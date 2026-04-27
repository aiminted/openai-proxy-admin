# syntax=docker/dockerfile:1.4
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# xquare CI mounts Vault KV at /run/secrets/vault_env (KEY=VALUE per line).
# Sourcing them here lets vite bake VITE_* env vars into the bundle at build
# time without ever leaving them in the image history.
RUN --mount=type=secret,id=vault_env \
    if [ -f /run/secrets/vault_env ]; then set -a; . /run/secrets/vault_env; set +a; fi && \
    npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
