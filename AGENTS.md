# acaccel-site project instructions

Authoritative project rule set; `CLAUDE.md` points here.

## Stack

- Static personal website for `https://acserver.csie.org/`, served from a release directory by the host's LCM ingress.
- Astro and TypeScript; UI components are React with Material UI (Emotion), rendered at build
  time only. Prettier, ESLint, and `astro check`.
- Node 24 LTS from the project-local conda environment in `.conda/`; do not use the system Node.

## Setup and validation

```sh
CONDA_EXE=~/miniforge3/bin/conda scripts/setup-env.sh   # create .conda and run npm ci
export PATH="$PWD/.conda/bin:$PATH"
npm run dev      # local dev server
npm run format   # apply Prettier
npm run photos   # strip metadata from album photos before committing them
npm run check    # format, lint, types, deploy script syntax, photo metadata, build, dist checks
```

Deployment and rollback: [docs/deployment.md](docs/deployment.md).

## Layout

| Path                                      | Purpose                                                       |
| ----------------------------------------- | ------------------------------------------------------------- |
| `src/pages/`                              | Routes; see [docs/writing.md](docs/writing.md) for each page  |
| `src/layouts/`                            | `BaseLayout` (head, meta) and `PageLayout` (page shell)       |
| `src/components/`                         | React components; `PageShell` holds the app bar and footer    |
| `src/theme/`                              | MUI theme and the `ThemeRoot` wrapper every root needs        |
| `content/`                                | Hand-written content; see [docs/writing.md](docs/writing.md)  |
| `src/content.config.ts`                   | Content schemas                                               |
| `src/data/`                               | Content loading; `text.ts` loads and validates `site.yaml`    |
| `src/integrations/`                       | Build hook removing source images copied into `dist/`         |
| `scripts/check-dist.py`                   | Fails on inline script or unreferenced images in `dist/`      |
| `scripts/photos.mjs`                      | Strips photo metadata; `--check` mode runs in `npm run check` |
| `deploy/`                                 | Release deploy and rollback scripts                           |
| `environment.yml`, `scripts/setup-env.sh` | Toolchain environment                                         |
| `docs/roadmap.md`                         | Audience, site structure, design, next directions             |

## Rules

- Content is Traditional Chinese (Taiwan); an English edition is undecided. The old `/en/` path
  redirects to `/` at the ingress.
- Every visible text lives in `content/` (short texts in `site.yaml`); code reads it through
  `text` from `src/data/text.ts`. ESLint rejects Chinese text written directly in `src/`.
- The repository is public: list only public services, and commit no private service names,
  paths, internal ports, or personal data beyond what the site already publishes.
- Adding a service is a data-only change to `services.json`. Its `url` is a full HTTPS address;
  on this site's host the path is a single segment such as `/name/` and must not be a site path
  (`reservedPaths` in `src/data/services.ts`).
- UI uses Material UI components and design; hand-build only what it cannot cover, in the same
  style. Components never hydrate (no `client:*` directives); small browser behavior goes in a
  bundled `<script>` in an `.astro` file. Every React component rendered from Astro wraps its
  content in `ThemeRoot`.
- Material UI renders inline `<style>` elements, so the CSP allows `'unsafe-inline'` in
  `style-src`. Scripts stay strict: `script-src 'self'` only, no inline scripts or handlers
  (`npm run test:dist` enforces this). `connect-src 'self'` lets the service status check
  request this site only.
- Album photos are public: commit them only after `npm run photos` removes their metadata.
- Output stays fully static; the site runs no server process.
- This repository holds no Nginx or TLS configuration; routing is the ingress route in
  [docs/deployment.md](docs/deployment.md#ingress-route).
