import { getCollection, type CollectionEntry } from 'astro:content';
import { formatDate, isoDate } from './dates';
import { getPosts, postHref, type Post } from './posts';
import { text } from './text';

export type HobbyCategoryId = 'games' | 'photos';

export interface HobbyCategory {
  id: HobbyCategoryId;
  title: string;
  description?: string | undefined;
  href: string;
  /** Posts with this tag appear as related write-ups. */
  tag: string;
}

export const hobbyCategories: HobbyCategory[] = [
  {
    id: 'games',
    title: text.hobbies.games.title,
    description: text.hobbies.games.description,
    href: '/hobbies/games/',
    tag: 'games',
  },
  {
    id: 'photos',
    title: text.hobbies.photos.title,
    description: text.hobbies.photos.description,
    href: '/hobbies/photos/',
    tag: 'travel',
  },
];

export function hobbyCategory(id: HobbyCategoryId): HobbyCategory {
  const category = hobbyCategories.find((entry) => entry.id === id);
  if (!category) throw new Error(`Unknown hobby category: ${id}`);
  return category;
}

/** Plain log entry fields for list components. */
export interface LogEntry {
  id: string;
  title: string;
  /** Platform. */
  meta?: string | undefined;
  note?: string | undefined;
  updated?: string | undefined;
  updatedISO?: string | undefined;
  postHref?: string | undefined;
  link?: string | undefined;
}

export interface LogGroup {
  id: string;
  title: string;
  entries: LogEntry[];
}

type LogData = CollectionEntry<'games'>['data'];

/**
 * Resolves `post` to a link. An unknown id fails the build; a post that is still a draft is
 * skipped so the deployed entry never links to a missing page.
 */
function resolvePost(entry: LogData, posts: Post[], allPostIds: Set<string>): string | undefined {
  if (!entry.post) return undefined;
  if (!allPostIds.has(entry.post)) {
    throw new Error(`Hobby entry "${entry.id}" names unknown post "${entry.post}"`);
  }
  const post = posts.find((candidate) => candidate.id === entry.post);
  return post && postHref(post);
}

/** Newest update first; entries without a date go last, then by title. */
function byUpdated(a: LogData, b: LogData): number {
  const diff = (b.updated?.getTime() ?? 0) - (a.updated?.getTime() ?? 0);
  return diff || a.title.localeCompare(b.title, 'zh-TW');
}

async function loadPosts(): Promise<{ posts: Post[]; allPostIds: Set<string> }> {
  const posts = await getPosts();
  const allPostIds = new Set((await getCollection('posts')).map((post) => post.id));
  return { posts, allPostIds };
}

function toLogEntry(
  entry: LogData,
  meta: string | undefined,
  postLink: string | undefined,
): LogEntry {
  return {
    id: entry.id,
    title: entry.title,
    meta,
    note: entry.note,
    updated: entry.updated && formatDate(entry.updated),
    updatedISO: entry.updated && isoDate(entry.updated),
    postHref: postLink,
    link: entry.link,
  };
}

const gameStatuses = (['playing', 'finished', 'paused'] as const).map((status) => ({
  status,
  label: text.hobbies.games.status[status],
}));

/** Games grouped by status in display order; empty groups are dropped. */
export async function getGameGroups(): Promise<LogGroup[]> {
  const games = (await getCollection('games')).map((entry) => entry.data).sort(byUpdated);
  const { posts, allPostIds } = await loadPosts();
  return gameStatuses
    .map((status) => ({
      id: status.status,
      title: status.label,
      entries: games
        .filter((game) => game.status === status.status)
        .map((game) => toLogEntry(game, game.platform, resolvePost(game, posts, allPostIds))),
    }))
    .filter((group) => group.entries.length > 0);
}

export type Album = CollectionEntry<'albums'>;

/** Published albums, newest first; drafts are included only in the dev server. */
export async function getAlbums(): Promise<Album[]> {
  const albums = await getCollection('albums', ({ data }) => import.meta.env.DEV || !data.draft);
  return albums.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Entry counts per category, for the hobbies overview. */
export async function getHobbyCounts(): Promise<Record<HobbyCategoryId, number>> {
  return {
    games: (await getCollection('games')).length,
    photos: (await getAlbums()).length,
  };
}
