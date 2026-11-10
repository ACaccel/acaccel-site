import type { ReactNode } from 'react';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ThemeRoot from '../theme/ThemeRoot';
import Prose from './Prose';
import Trail from './Trail';
import { tagHref } from '../data/posts';
import { trails } from '../data/site';
import { around, fill, text } from '../data/text';

export interface TocHeading {
  depth: number;
  slug: string;
  text: string;
}

interface PostLink {
  href: string;
  title: string;
}

interface Props {
  title: string;
  date: string;
  dateISO: string;
  updated?: string | undefined;
  updatedISO?: string | undefined;
  minutes: number;
  tags: string[];
  /** Shown beside the article on wide screens; empty hides the sidebar. */
  toc: TocHeading[];
  older?: PostLink | undefined;
  newer?: PostLink | undefined;
  children?: ReactNode;
}

export const articleMaxWidth = 712;

export default function PostArticle(props: Props) {
  const { title, date, dateISO, updated, updatedISO, minutes, tags, toc, older, newer } = props;
  const updatedText = around(text.posts.updated, 'date');
  return (
    <ThemeRoot>
      <Box
        sx={{
          display: 'grid',
          // The table of contents sits at the right edge of the page, apart from the article.
          justifyContent: 'space-between',
          columnGap: 6,
          gridTemplateColumns: {
            xs: `minmax(0, ${articleMaxWidth}px)`,
            lg: toc.length > 0 ? `minmax(0, ${articleMaxWidth}px) 220px` : undefined,
          },
        }}
      >
        <Box
          component="article"
          // Labels for the copy buttons that the page script adds to code blocks.
          data-copy={text.posts.copy}
          data-copied={text.posts.copied}
          data-copy-failed={text.posts.copyFailed}
          sx={{ minWidth: 0 }}
        >
          <Box component="header" sx={{ mb: 3 }}>
            <Trail links={trails.posts} />
            <Typography variant="h1">{title}</Typography>
            <Typography color="text.secondary" sx={{ mt: 1.5 }}>
              <time dateTime={dateISO}>{date}</time>
              {updated && updatedISO && (
                <>
                  {' · '}
                  {updatedText[0]}
                  <time dateTime={updatedISO}>{updated}</time>
                  {updatedText[1]}
                </>
              )}
              {` · ${fill(text.posts.readingTime, { minutes })}`}
            </Typography>
            {tags.length > 0 && (
              <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    component="a"
                    href={tagHref(tag)}
                    clickable
                    size="small"
                    variant="outlined"
                    label={`#${tag}`}
                  />
                ))}
              </Stack>
            )}
          </Box>
          <Prose>{props.children}</Prose>
          {(older || newer) && (
            <Box
              component="nav"
              aria-label={text.posts.otherPosts}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2,
                mt: 6,
                pt: 3,
                borderTop: 1,
                borderColor: 'divider',
              }}
            >
              <Box>
                {older && (
                  <Button href={older.href} startIcon={<ArrowBack />} sx={{ textAlign: 'left' }}>
                    <span>
                      <Typography
                        variant="caption"
                        component="span"

                        color="text.secondary"
                        sx={{ display: 'block' }}
                      >
                        {text.posts.older}
                      </Typography>
                      {older.title}
                    </span>
                  </Button>
                )}
              </Box>
              <Box sx={{ textAlign: { sm: 'right' } }}>
                {newer && (
                  <Button href={newer.href} endIcon={<ArrowForward />} sx={{ textAlign: 'right' }}>
                    <span>
                      <Typography
                        variant="caption"
                        component="span"

                        color="text.secondary"
                        sx={{ display: 'block' }}
                      >
                        {text.posts.newer}
                      </Typography>
                      {newer.title}
                    </span>
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </Box>
        {toc.length > 0 && (
          <Box
            component="nav"
            aria-label={text.posts.toc}
            sx={{
              display: { xs: 'none', lg: 'block' },
              position: 'sticky',
              top: 96,
              alignSelf: 'start',
              maxHeight: 'calc(100vh - 128px)',
              overflowY: 'auto',
            }}
          >
            <Typography variant="overline" color="text.secondary">
              {text.posts.toc}
            </Typography>
            <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
              {toc.map((heading) => (
                <Box
                  component="li"
                  key={heading.slug}
                  sx={{ pl: (heading.depth - 2) * 1.5, py: 0.5 }}
                >
                  <Link href={`#${heading.slug}`} variant="body2" color="text.secondary">
                    {heading.text}
                  </Link>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </ThemeRoot>
  );
}
