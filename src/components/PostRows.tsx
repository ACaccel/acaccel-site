import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { PostSummary } from '../data/posts';

/**
 * Posts as rows with the date in its own column, easier to scan than cards as the list grows.
 * Render inside a ThemeRoot.
 */
export default function PostRows({ posts }: { posts: PostSummary[] }) {
  return (
    <Box
      component="ul"
      sx={{ m: 0, p: 0, listStyle: 'none', borderTop: 1, borderColor: 'divider' }}
    >
      {posts.map((post) => (
        <Box component="li" key={post.href} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Box
            component="a"
            href={post.href}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '9rem minmax(0, 1fr)' },
              columnGap: 3,
              rowGap: 0.5,
              px: 1.5,
              py: 2,
              color: 'inherit',
              textDecoration: 'none',
              '&:hover': { bgcolor: 'action.hover' },
              '&:hover h3': { color: 'primary.main' },
              '&:focus-visible': { outline: 2, outlineColor: 'primary.main', outlineOffset: -2 },
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              component="time"
              dateTime={post.dateISO}
              sx={{ pt: { sm: 0.25 } }}
            >
              {post.date}
            </Typography>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h3" component="h3" sx={{ transition: 'color 150ms' }}>
                {post.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {post.description}
              </Typography>
              {post.tags.length > 0 && (
                <Typography variant="caption" color="primary" component="p" sx={{ mt: 0.75 }}>
                  {post.tags.map((tag) => `#${tag}`).join(' ')}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
