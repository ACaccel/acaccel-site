# Writing content

Everything visitors read lives in `content/`; editing it needs no code changes.

| File                       | Shown as                                                          |
| -------------------------- | ----------------------------------------------------------------- |
| `content/site.yaml`        | All short texts: name, links, navigation, titles, buttons, labels |
| `content/posts/<id>.md`    | Post at `/posts/<id>/`, listed newest first                       |
| `content/now.md`           | Now page at `/now/` and the homepage card                         |
| `content/about.md`         | Introduction on `/about/`                                         |
| `content/experience.yaml`  | Experience summary on `/about/` (hidden while empty)              |
| `content/games.yaml`       | Games on `/hobbies/games/`                                        |
| `content/albums/<id>/`     | Album at `/hobbies/photos/<id>/`                                  |
| `content/services.json`    | Services on `/services/` and the homepage                         |
| `content/projects/<id>.md` | Project at `/projects/<id>/`; `featured` ones on the homepage     |

## Short texts

`site.yaml` is grouped by page, and its header comment explains the rules:

- Keep placeholders such as `{count}` or `{date}`; the site fills them in. `{name}` works
  anywhere and becomes `profile.name`.
- Texts marked optional, such as `about.cvNote` or `profile.email`, can be left empty (`''`) to
  hide them.
- A missing key, an unknown key, or a dropped placeholder fails the build with the exact path,
  such as `posts.readingTime: Keep the placeholders {minutes}`.

## Posts

The file name becomes the URL, so use lowercase words joined by hyphens, such as
`nginx-routing.md`. [`example-post.md`](../content/posts/example-post.md) is a draft
template.

Front matter fields:

| Field         | Required | Notes                                                                    |
| ------------- | -------- | ------------------------------------------------------------------------ |
| `title`       | Yes      | Page title and list entry                                                |
| `description` | Yes      | One-line summary for the list and search engines                         |
| `date`        | Yes      | Publication date, `YYYY-MM-DD`                                           |
| `updated`     | No       | Last significant revision, `YYYY-MM-DD`                                  |
| `tags`        | No       | Lowercase slugs such as `[nginx, games]`; each gets `/posts/tags/<tag>/` |
| `draft`       | No       | `true` hides the post from the deployed site; default `false`            |

The build fails on a missing or misspelled field, so a broken post never goes live. Code blocks
get syntax highlighting when they name a language, such as ` ```ts `.

Posts with two or more `##`/`###` headings get a table of contents on wide screens. Published
posts also appear in the RSS feed at `/rss.xml`.

## Now

`now.md` front matter: `summary` (one or two sentences for the homepage card), `updated`
(`YYYY-MM-DD`), and `draft`. While `draft: true`, the page, the homepage card, and the footer
link stay out of the deployed site.

## Services

Each key in `services.json` maps to `name`, `url` (full HTTPS address), `description`, and optional
`source` (HTTPS URL), `status` (`active` default, `beta`, `maintenance`, or `archived`; archived
services lose the open button and leave the homepage), and `stack` (technology names).

Visitors' browsers check each `active` or `beta` service on this site and show 無法連線
instead of its status when it does not answer within 8 seconds. Browsers may only request this
site, so services elsewhere, such as a Discord bot with its invite link as `url`, always show
their written `status`.

## Projects

[`example-project.md`](../content/projects/example-project.md) is a draft template with the
suggested sections. Front matter: `title`, `summary`, `role` (such as 開發, 協作, 代管), `start`
and optional `end` (`YYYY-MM`), and optional `stack`, `links` (`label` and HTTPS `href`),
`service` (a key in `services.json`, adds an open button), `featured` (show on the homepage),
and `draft`.

## Experience

Each entry in `experience.yaml` has a unique `id`, `title`, `organization`, `start` (`YYYY-MM`),
an optional `end` (omit while ongoing), and an optional one-sentence `description`. Entries are
listed newest first. The file's header comment shows an example.

## Hobbies

`games.yaml` is a list; its header comment shows every field: unique `id`, `title`, `status`,
and optional `platform`, `note`, `updated` (`YYYY-MM-DD`), `post` (id of a longer write-up), and
`link`. A `post` that is still a draft is not linked; an unknown id fails the build.

Posts tagged `games` or `travel` appear as related posts in the matching category.

## Photos

Each album is a folder `content/albums/<id>/` with `index.md` and its photos;
[`example-album`](../content/albums/example-album/index.md) is a draft template. Front
matter: `title`, `date`, `description`, `cover` and `photos[].src` (paths such as
`./photo-1.jpg`), `photos[].alt` (what the photo shows), and optional `location`,
`photos[].caption`, and `draft`.

Photos are public once committed, so before committing run:

```sh
npm run photos   # rotate upright, fit within 2560px, remove EXIF/GPS and other metadata
```

`npm run check` fails on photos that still carry metadata. The site serves only resized WebP
copies; the build removes the original files from its output.

## Preview and publish

1. Run `npm run dev` and open the printed address; drafts are visible there. With VS Code Remote
   SSH, the port is forwarded automatically.
2. Commit and push the change; the host deploys `main` once CI passes ([deployment.md](deployment.md)).
