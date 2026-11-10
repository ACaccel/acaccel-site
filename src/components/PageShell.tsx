import type { ReactNode } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ThemeRoot from '../theme/ThemeRoot';
import { isActiveNav, site } from '../data/site';
import { profile } from '../data/profile';
import { text } from '../data/text';

export type PageWidth = 'wide' | 'narrow';

export const pageMaxWidth: Record<PageWidth, number> = { wide: 1280, narrow: 760 };

// Hidden on screen but still read as the home link's name.
const visuallyHidden = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
} as const;

interface Props {
  currentPath: string;
  width: PageWidth;
  /** The Now page is skipped while it is a draft, so the footer links to it only when built. */
  showNow: boolean;
  children?: ReactNode;
}

export default function PageShell({ currentPath, width, showNow, children }: Props) {
  const footerLinks: { label: string; href: string; rel?: string }[] = [
    ...profile.links.map((link) => ({ ...link, rel: 'me noopener' })),
    ...(profile.email ? [{ label: text.footer.email, href: `mailto:${profile.email}` }] : []),
    ...(showNow ? [{ label: text.footer.now, href: '/now/' }] : []),
    { label: text.footer.rss, href: '/rss.xml' },
    { label: text.footer.source, href: site.sourceUrl, rel: 'noopener' },
  ];

  return (
    <ThemeRoot>
      <CssBaseline />
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          bgcolor: 'color-mix(in srgb, var(--mui-palette-background-default) 88%, transparent)',
          backdropFilter: 'blur(8px)',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: pageMaxWidth.wide }}>
          <Toolbar disableGutters sx={{ columnGap: 2 }}>
            <Link
              href="/"
              color="inherit"
              underline="none"
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 'auto', fontWeight: 700 }}
            >
              <Box component="img" src="/favicon.svg" alt="" width={28} height={28} />
              {/* Phones show only the icon so the five nav labels fit on the same row. */}
              <Box
                component="span"
                sx={(theme) => ({ [theme.breakpoints.down('sm')]: visuallyHidden })}
              >
                {profile.name}
              </Box>
            </Link>
            {/* Five short labels fit on phones, so the nav stays visible instead of in a menu. */}
            <Box
              component="nav"
              aria-label={text.nav.label}
              sx={{
                display: 'flex',
                gap: { xs: 0, sm: 0.5 },
                overflowX: 'auto',
                mr: { xs: -1, sm: 0 },
              }}
            >
              {site.nav.map((item) => {
                const active = isActiveNav(item, currentPath);
                return (
                  <Button
                    key={item.href}
                    href={item.href}
                    color={active ? 'primary' : 'inherit'}
                    aria-current={active ? 'page' : undefined}
                    sx={{ minWidth: 0, px: { xs: 1, sm: 1.5 }, flexShrink: 0 }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {/* Narrow pages keep the wide container's left edge so content lines up with the header. */}
      <Container
        component="main"
        maxWidth={false}
        sx={{ flexGrow: 1, maxWidth: pageMaxWidth.wide, py: { xs: 3, md: 4 } }}
      >
        <Box sx={{ maxWidth: pageMaxWidth[width] }}>{children}</Box>
      </Container>
      <Box component="footer" sx={{ borderTop: 1, borderColor: 'divider', mt: 6 }}>
        <Container
          maxWidth={false}
          sx={{
            maxWidth: pageMaxWidth.wide,
            py: 3,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} {profile.name}
          </Typography>
          <Stack
            component="ul"
            direction="row"
            useFlexGap
            sx={{ flexWrap: 'wrap', gap: 2, m: 0, p: 0, listStyle: 'none' }}
          >
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} rel={link.rel} variant="body2" color="text.secondary">
                  {link.label}
                </Link>
              </li>
            ))}
          </Stack>
        </Container>
      </Box>
    </ThemeRoot>
  );
}
