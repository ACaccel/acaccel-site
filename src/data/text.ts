import { z } from 'astro/zod';
import { parse } from 'yaml';
// ?raw keeps the file in Vite's module graph, so the dev server reloads on edits.
import source from '../../content/site.yaml?raw';

const line = z.string().min(1);

/** Text that must keep each `{placeholder}`, because the site fills it in. */
function template(...names: string[]) {
  return line.refine((value) => names.every((name) => value.includes(`{${name}}`)), {
    message: `Keep the placeholders ${names.map((name) => `{${name}}`).join(', ')}`,
  });
}

/** Optional text; empty, blank (null in YAML), or missing hides it. */
const optional = z
  .string()
  .nullish()
  .transform((value) => value?.trim() || undefined);

const titled = z.strictObject({ title: line, more: line });

const schema = z.strictObject({
  profile: z.strictObject({
    name: line,
    tagline: line,
    email: optional,
    links: z.array(z.strictObject({ label: line, href: z.url({ protocol: /^https$/ }) })),
  }),
  site: z.strictObject({
    description: line,
    sourceUrl: z.url({ protocol: /^https$/ }),
  }),
  nav: z.strictObject({
    posts: line,
    hobbies: line,
    projects: line,
    services: line,
    about: line,
    label: line,
    breadcrumb: line,
  }),
  footer: z.strictObject({ email: line, now: line, rss: line, source: line }),
  home: z.strictObject({
    aboutButton: line,
    emailButton: line,
    now: z.strictObject({ title: line, updated: template('date'), more: line }),
    posts: titled,
    hobbies: titled,
    projects: titled,
    services: titled,
  }),
  posts: z.strictObject({
    title: line,
    description: optional,
    empty: line,
    allTags: line,
    tagsLabel: line,
    tagDescription: template('tag'),
    updated: template('date'),
    readingTime: template('minutes'),
    toc: line,
    older: line,
    newer: line,
    otherPosts: line,
    copy: line,
    copied: line,
    copyFailed: line,
    rssTitle: line,
  }),
  now: z.strictObject({ title: line, updated: template('date') }),
  about: z.strictObject({
    title: line,
    description: optional,
    experience: line,
    contact: line,
    cvNote: optional,
    present: line,
  }),
  services: z.strictObject({
    title: line,
    description: optional,
    empty: line,
    open: line,
    source: line,
    status: z.strictObject({ active: line, beta: line, maintenance: line, archived: line }),
    /** Replaces the status when the live check gets no answer. */
    unreachable: line,
  }),
  projects: z.strictObject({
    title: line,
    description: optional,
    empty: line,
    role: template('role'),
    open: line,
  }),
  hobbies: z.strictObject({
    title: line,
    description: optional,
    empty: line,
    entryCount: template('count'),
    relatedPosts: line,
    readPost: line,
    link: line,
    games: z.strictObject({
      title: line,
      description: optional,
      status: z.strictObject({ playing: line, finished: line, paused: line }),
    }),
    photos: z.strictObject({
      title: line,
      description: optional,
      empty: line,
      albumCount: template('count'),
    }),
  }),
  notFound: z.strictObject({ title: line, message: line, home: line }),
});

export type SiteText = z.infer<typeof schema>;

/** Replaces `{name}` in every string, before validation. */
function withName(value: unknown, name: string): unknown {
  if (typeof value === 'string') return value.replaceAll('{name}', name);
  if (Array.isArray(value)) return value.map((item) => withName(item, name));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, withName(item, name)]),
    );
  }
  return value;
}

function load(): SiteText {
  const raw: unknown = parse(source);
  const name = (raw as { profile?: { name?: unknown } } | null)?.profile?.name;
  const result = schema.safeParse(typeof name === 'string' ? withName(raw, name) : raw);
  if (!result.success) {
    const problems = result.error.issues
      .map((issue) => `  ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n');
    throw new Error(`content/site.yaml is invalid:\n${problems}`);
  }
  return result.data;
}

/** All short site texts from content/site.yaml, validated at build time. */
export const text = load();

/** Fills `{key}` placeholders in a text from site.yaml. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/**
 * Splits a text at one `{key}` placeholder, for wrapping the value in markup such as `<time>`.
 * Validation guarantees the placeholder exists.
 */
export function around(template: string, key: string): [before: string, after: string] {
  const index = template.indexOf(`{${key}}`);
  return [template.slice(0, index), template.slice(index + key.length + 2)];
}
