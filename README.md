# openai-proxy admin

Web admin for [openai-proxy](https://github.com/aiminted/openai-proxy). Issues per-user proxy keys, tracks usage, and edits limits. Talks to the proxy's `/admin/api/*` endpoints over Bearer-token auth.

## Local Development

```bash
npm install
npm run dev    # http://localhost:5173, /admin/api proxied to localhost:8080
```

Set `VITE_API_BASE_URL` to override the API host (e.g. `http://localhost:8080`). With the dev proxy in `vite.config.ts`, leaving it unset is normally fine.

## Build

```bash
npm run build           # outputs static files to dist/
VITE_API_BASE_URL=https://openai-proxy.dsmhs.kr npm run build
```

## Deploy

Built as a small nginx image:

```bash
docker build --build-arg VITE_API_BASE_URL=https://openai-proxy.dsmhs.kr -t admin .
docker run -p 8080:8080 admin
```

The backend must include this admin's origin in its `CORS_ORIGINS` env var.
