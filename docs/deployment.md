# Deployment

The built site is copied into a release directory and a `current` symlink points at it. No server
process runs. Nginx and TLS are not part of this repository: the host's LCM ingress serves the
`current` link, as described in the "Ingress" and "Routes" sections of `docs/operations.md` in the LCM repository. This
repository's scripts only manage releases.

## Requirements

- Uncommitted changes are allowed; their release name ends in `-dirty`, so the live site cannot
  be rebuilt from the commit alone. Commit first when the release must be traceable.
- Project toolchain installed; see [AGENTS.md](../AGENTS.md#setup-and-validation).
- Deployment user with sudo; the host has `rsync` and `flock`.
- The host's ingress grants this site the route prefix `/` with a static directory of
  `/var/www/acaccel-site/current` (see [Ingress route](#ingress-route)).

## Deploy

```sh
bash deploy/deploy.sh
```

1. As the invoking user: warns about uncommitted changes, runs `npm run check`, then reruns
   itself through `sudo`.
2. Takes `/run/lock/acaccel-site-deploy.lock`.
3. Copies `dist/` to `releases/<UTC time>-<commit>[-dirty]/` and switches the `current` symlink.
4. Checks that `current/index.html` and `current/404.html` exist.
5. Keeps the newest five releases.

On any failure, including an interrupt, the script points `current` back at the previous release
and removes the new one. The ingress follows the link per request, so a deploy or rollback needs
no ingress change.

## Roll back

```sh
bash deploy/rollback.sh
```

Points `current` at the release immediately before it.

## Ingress route

What the site needs from the ingress:

| Need                | Value                                                             |
| ------------------- | ----------------------------------------------------------------- |
| Static root         | `/var/www/acaccel-site/current` (host grant, `external` service)  |
| Prefix              | `/`                                                               |
| Not found           | `404.html`, served with status 404                                |
| Immutable cache     | `_astro/` (hashed build output, cached for a year, no fallback)   |
| Former English path | `/en/` redirects to `/`                                           |
| Security headers    | The CSP below; the ingress adds `nosniff` and the referrer policy |

The host grant (prefix and static root) lives in the host configuration; the presentation options
are the `route` section of the site's LCM Resource document:

```yaml
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
      base-uri 'none'; form-action 'none'; frame-ancestors 'none'
```

Notes:

- Material UI renders inline `<style>` elements, so `style-src` needs `'unsafe-inline'`; scripts
  stay external (`script-src 'self'`).
- Only `_astro/` is immutable; the ingress serves every other file with `Cache-Control: no-cache`
  because pages change in place under the same URL.
- A service on the same host under a longer prefix (for example `/name/`) takes precedence over
  this site's `/`.

## Host paths

| Path                              | Contents                    |
| --------------------------------- | --------------------------- |
| `/var/www/acaccel-site/current`   | Symlink to the live release |
| `/var/www/acaccel-site/releases/` | Release directories         |
