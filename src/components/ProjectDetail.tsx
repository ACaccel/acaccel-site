import type { ReactNode } from 'react';
import ArrowOutward from '@mui/icons-material/ArrowOutward';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ThemeRoot from '../theme/ThemeRoot';
import LinkIcon from './LinkIcon';
import { articleMaxWidth } from './PostArticle';
import Prose from './Prose';
import Trail from './Trail';
import type { ProjectSummary } from '../data/projects';
import type { Service } from '../data/services';
import { trails } from '../data/site';
import { fill, text } from '../data/text';

interface Props {
  project: ProjectSummary;
  links: { label: string; href: string }[];
  service?: Service | undefined;
  /** The rendered case study. */
  children?: ReactNode;
}

/**
 * The facts and links sit in a sidebar beside the case study on wide screens, and between the
 * title and the case study on phones.
 */
export default function ProjectDetail({ project, links, service, children }: Props) {
  const openService = service && service.status !== 'archived';
  return (
    <ThemeRoot>
      <Box
        sx={{
          display: 'grid',
          // The sidebar sits at the right edge of the page, apart from the case study.
          justifyContent: 'space-between',
          columnGap: 6,
          gridTemplateColumns: {
            xs: 'minmax(0, 1fr)',
            md: `minmax(0, ${articleMaxWidth}px) 260px`,
          },
          gridTemplateAreas: {
            xs: '"header" "facts" "body"',
            md: '"header facts" "body facts"',
          },
          gridTemplateRows: { md: 'auto 1fr' },
        }}
      >
        <Box component="header" sx={{ gridArea: 'header', mb: 3 }}>
          <Trail links={trails.projects} />
          <Typography variant="h1">{project.title}</Typography>
          <Typography color="text.secondary" sx={{ mt: 1.5, fontSize: '1.0625rem' }}>
            {project.summary}
          </Typography>
        </Box>
        <Box
          component="aside"
          sx={{
            gridArea: 'facts',
            alignSelf: 'start',
            position: { md: 'sticky' },
            top: { md: 96 },
            mb: { xs: 3, md: 0 },
            p: 2,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {project.period}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {fill(text.projects.role, { role: project.role })}
          </Typography>
          {project.stack.length > 0 && (
            <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 0.75, mt: 1.5 }}>
              {project.stack.map((item) => (
                <Chip key={item} size="small" label={item} />
              ))}
            </Stack>
          )}
          {(openService || links.length > 0) && (
            <Stack useFlexGap sx={{ gap: 1, mt: 2 }}>
              {openService && (
                <Button variant="contained" href={service.url} endIcon={<ArrowOutward />}>
                  {text.projects.open}
                </Button>
              )}
              {links.map((link) => (
                <Button
                  key={link.href}
                  variant="outlined"
                  href={link.href}
                  rel="noopener"
                  startIcon={<LinkIcon href={link.href} />}
                >
                  {link.label}
                </Button>
              ))}
            </Stack>
          )}
        </Box>
        <Box sx={{ gridArea: 'body', minWidth: 0 }}>
          <Prose>{children}</Prose>
        </Box>
      </Box>
    </ThemeRoot>
  );
}
