import { getCollection, type CollectionEntry } from 'astro:content';

export type Service = CollectionEntry<'services'>['data'] & {
  /** Same-site path the browser fetches to show live status; unset when it cannot be checked. */
  checkPath?: string | undefined;
};

// Paths that belong to this site and must not be claimed by a service; /en/ redirects to /.
const reservedPaths = new Set([
  '/_astro/',
  '/about/',
  '/en/',
  '/hobbies/',
  '/now/',
  '/posts/',
  '/projects/',
  '/services/',
]);

// A single path segment, matching how each service on this host is mounted at the ingress.
const servicePath = /^\/[a-z0-9-]+\/$/;

const siteHost = new URL(import.meta.env.SITE).host;

/** Throws when a service on this site's host is not mounted at its own single path segment. */
function checkSiteUrl(name: string, url: URL): void {
  if (url.host !== siteHost) return;
  if (!servicePath.test(url.pathname) || url.search || url.hash) {
    throw new Error(`Service "${name}" on this site must use a single path such as /name/: ${url}`);
  }
  if (reservedPaths.has(url.pathname)) {
    throw new Error(`Service "${name}" uses a reserved site path: ${url.pathname}`);
  }
}

/**
 * The CSP limits browser requests to this site, so services elsewhere, such as Discord bots,
 * keep their written status. Services under maintenance or archived are not expected to answer,
 * so their written status stays too.
 */
function checkPath(service: Service): string | undefined {
  if (service.status === 'maintenance' || service.status === 'archived') return undefined;
  const url = new URL(service.url);
  return url.host === siteHost ? url.pathname : undefined;
}

export async function getServices(): Promise<Service[]> {
  const services = (await getCollection('services')).map((entry) => entry.data);
  const seen = new Set<string>();
  for (const { name, url } of services) {
    checkSiteUrl(name, new URL(url));
    if (seen.has(url)) {
      throw new Error(`Service "${name}" uses a duplicate URL: ${url}`);
    }
    seen.add(url);
  }
  return services
    .map((service) => ({ ...service, checkPath: checkPath(service) }))
    .sort((a, b) => a.name.localeCompare(b.name, 'en'));
}
