import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ThemeRoot from '../theme/ThemeRoot';
import CardGrid from './CardGrid';
import EmptyState from './EmptyState';
import PageHeader from './PageHeader';
import RelatedPosts from './RelatedPosts';
import type { TrailLink } from './Trail';
import type { LogEntry, LogGroup } from '../data/hobbies';
import type { PostSummary } from '../data/posts';
import { text } from '../data/text';

interface Props {
  title: string;
  description?: string | undefined;
  trail: TrailLink[];
  groups: LogGroup[];
  relatedPosts: PostSummary[];
  relatedTag: string;
}

function LogCard({ entry }: { entry: LogEntry }) {
  const hasActions = entry.postHref || entry.link;
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        {/* The group heading already names the status. */}
        <Typography variant="h3" component="h3">
          {entry.title}
        </Typography>
        {(entry.meta || entry.updated) && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {entry.meta}
            {entry.meta && entry.updated && ' · '}
            {entry.updated && <time dateTime={entry.updatedISO}>{entry.updated}</time>}
          </Typography>
        )}
        {entry.note && (
          <Typography variant="body2" sx={{ mt: 1.5 }}>
            {entry.note}
          </Typography>
        )}
      </CardContent>
      {hasActions && (
        <CardActions sx={{ px: 2, pb: 2 }}>
          {entry.postHref && (
            <Button size="small" variant="outlined" href={entry.postHref}>
              {text.hobbies.readPost}
            </Button>
          )}
          {entry.link && (
            <Button size="small" href={entry.link} rel="noopener">
              {text.hobbies.link}
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
}

export default function LogPage(props: Props) {
  const { title, description, trail, groups, relatedPosts, relatedTag } = props;
  return (
    <ThemeRoot>
      <PageHeader title={title} description={description} trail={trail} />
      {groups.length === 0 && <EmptyState>{text.hobbies.empty}</EmptyState>}
      {groups.map((group) => (
        <Box
          component="section"
          key={group.id}
          aria-labelledby={group.id}
          sx={{ mt: 4, scrollMarginTop: '5rem' }}
        >
          <Typography variant="h2" id={group.id} sx={{ mb: 1.5, scrollMarginTop: '5rem' }}>
            {group.title}
          </Typography>
          <CardGrid>
            {group.entries.map((entry) => (
              <li key={entry.id}>
                <LogCard entry={entry} />
              </li>
            ))}
          </CardGrid>
        </Box>
      ))}
      <RelatedPosts posts={relatedPosts} tag={relatedTag} />
    </ThemeRoot>
  );
}
