import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const services = defineCollection({
  loader: file('content/services.json'),
  schema: z.strictObject({
    name: z.string().min(1),
    /** Full address; services on this site's host are checked in src/data/services.ts. */
    url: z.url({ protocol: /^https$/ }),
    description: z.string().min(1),
    source: z.url({ protocol: /^https$/ }).optional(),
    status: z.enum(['active', 'beta', 'maintenance', 'archived']).default('active'),
    /** Main technologies, shown as chips on /services/. */
    stack: z.array(z.string().min(1)).default([]),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/posts' }),
  schema: z.strictObject({
    title: z.string().min(1),
    description: z.string().min(1),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    // Lowercase slugs, used in /posts/tags/<tag>/ URLs.
    tags: z.array(z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)).default([]),
    draft: z.boolean().default(false),
  }),
});

const now = defineCollection({
  loader: glob({ pattern: 'now.md', base: './content' }),
  schema: z.strictObject({
    /** Shown on the homepage card. */
    summary: z.string().min(1),
    updated: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

// Year and month, such as 2024-09.
const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);

// Array entries in a data file carry their own id, which the file loader leaves in the data.
const entryId = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);

const experience = defineCollection({
  loader: file('content/experience.yaml'),
  schema: z.strictObject({
    id: entryId,
    title: z.string().min(1),
    organization: z.string().min(1),
    start: yearMonth,
    /** Omitted while ongoing. */
    end: yearMonth.optional(),
    description: z.string().min(1).optional(),
  }),
});

const link = z.strictObject({
  label: z.string().min(1),
  href: z.url({ protocol: /^https$/ }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/projects' }),
  schema: z.strictObject({
    title: z.string().min(1),
    summary: z.string().min(1),
    /** Your part in the project, such as 開發, 協作, or 代管. */
    role: z.string().min(1),
    start: yearMonth,
    end: yearMonth.optional(),
    stack: z.array(z.string().min(1)).default([]),
    links: z.array(link).default([]),
    /** Key of a related entry in services.json. */
    service: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

// Hobby log entries; `post` is the id of a longer write-up in content/posts.
const logEntry = {
  id: entryId,
  title: z.string().min(1),
  note: z.string().min(1).optional(),
  /** Last time this entry changed, such as when you finished it. */
  updated: z.coerce.date().optional(),
  post: z.string().optional(),
  link: z.url({ protocol: /^https$/ }).optional(),
};

const games = defineCollection({
  loader: file('content/games.yaml'),
  schema: z.strictObject({
    ...logEntry,
    status: z.enum(['playing', 'finished', 'paused']),
    platform: z.string().min(1).optional(),
  }),
});

const albums = defineCollection({
  // One folder per album: albums/<id>/index.md with its photos beside it.
  loader: glob({
    pattern: '*/index.md',
    base: './content/albums',
    generateId: ({ entry }) => entry.replace(/\/index\.md$/, ''),
  }),
  schema: ({ image }) =>
    z.strictObject({
      title: z.string().min(1),
      date: z.coerce.date(),
      location: z.string().min(1).optional(),
      description: z.string().min(1),
      cover: image(),
      photos: z
        .array(
          z.strictObject({
            src: image(),
            alt: z.string().min(1),
            caption: z.string().min(1).optional(),
          }),
        )
        .min(1),
      draft: z.boolean().default(false),
    }),
});

export const collections = {
  services,
  posts,
  now,
  experience,
  projects,
  games,
  albums,
};
