import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { text } from '../data/text';

export interface TrailLink {
  label: string;
  href: string;
}

/** Parent pages above a page title, nearest last; render inside a ThemeRoot. */
export default function Trail({ links }: { links: TrailLink[] }) {
  if (links.length === 0) return null;
  return (
    <Breadcrumbs aria-label={text.nav.breadcrumb} separator="›" sx={{ mb: 1, typography: 'body2' }}>
      {links.map((link) => (
        <Link key={link.href} href={link.href} color="text.secondary">
          {link.label}
        </Link>
      ))}
    </Breadcrumbs>
  );
}
