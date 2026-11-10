# Deployment

The host's LCM builds and publishes the site as a static `managed` service; this repository holds
no deployment, Nginx or TLS code. How LCM builds, publishes and rolls back is described in
`docs/services.md` of the LCM repository; routing is in the "Ingress" and "Routes" sections of its
`docs/operations.md`. No server process runs.

## What LCM runs

| Step    | Value                                                                        |
| ------- | ---------------------------------------------------------------------------- |
| Gate    | GitHub CI (`.github/workflows/ci.yml`, `npm run check`) passes on the commit |
| Build   | `npm ci && npm run build` with the Node version of `package.json` `engines`  |
| Output  | `dist/`                                                                      |
| Publish | `dist/` as the static root; `_astro/` files of earlier builds kept 14 days   |

- The build does not run the checks; CI does.
- Keeping old `_astro/` files lets pages that are already open load their hashed assets after a
  deploy.
- A rollback publishes the previous build again.

## Ingress route

What the site needs from the ingress:

| Need                | Value                                                             |
| ------------------- | ----------------------------------------------------------------- |
| Static root         | The service's publish directory (host grant)                      |
| Prefix              | `/`                                                               |
| Not found           | `404.html`, served with status 404                                |
| Immutable cache     | `_astro/` (hashed build output, cached for a year, no fallback)   |
| Former English path | `/en/` redirects to `/`                                           |
| Security headers    | The CSP below; the ingress adds `nosniff` and the referrer policy |

The host grant (prefix and static root) lives in the host configuration; the build, publish and
presentation options are the site's LCM Resource document:

```yaml
publish:
  dir: .
  retain: [_astro/]
  retainDays: 14
route:
  static:
    notFound: 404.html
    immutable: [_astro/]
  redirects:
    - from: en/
      to: /
      code: 301
  headers:
    csp: >-
      default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self';
      connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'
```

Notes:

- Material UI renders inline `<style>` elements, so `style-src` needs `'unsafe-inline'`; scripts
  stay external (`script-src 'self'`).
- Only `_astro/` is immutable; the ingress serves every other file with `Cache-Control: no-cache`
  because pages change in place under the same URL.
- A service on the same host under a longer prefix (for example `/name/`) takes precedence over
  this site's `/`.
