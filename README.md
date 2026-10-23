# mariobalca.com

My personal website and blog. Posts come from Tamable through its read API. `docs/requirements.md` describes how it works.

## Running it

Node 24.15 or newer (`.nvmrc`).

```bash
cp .env.example .env   # add the Tamable read key
npm install
npm run dev            # http://localhost:3000
```

| Command | Does |
|---|---|
| `npm run lint` | ESLint |
| `npm run typecheck` | `vue-tsc` through Nuxt |
| `npm test` | Vitest |
| `npm run build` | Prerenders the site into `.output` |
| `npm start` | Serves `.output` (preview and webhook routes included) |
