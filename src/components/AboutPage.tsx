import type { ReactNode } from 'react';
import MailOutlined from '@mui/icons-material/MailOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ThemeRoot from '../theme/ThemeRoot';
import LinkIcon from './LinkIcon';
import PageHeader from './PageHeader';
import Prose from './Prose';
import { profile } from '../data/profile';
import type { Experience } from '../data/about';
import { text } from '../data/text';

interface Props {
  experience: Experience[];
  /** The rendered `about.md`. */
  children?: ReactNode;
}

const sectionSx = { mt: 5 };

export default function AboutPage({ experience, children }: Props) {
  return (
    <ThemeRoot>
      <PageHeader title={text.about.title} />
      <Prose>{children}</Prose>

      {experience.length > 0 && (
        <Box component="section" aria-labelledby="experience-heading" sx={sectionSx}>
          <Typography variant="h2" id="experience-heading" sx={{ mb: 1.5 }}>
            {text.about.experience}
          </Typography>
          {/* A timeline: dates in their own column on wide screens, above each entry on phones. */}
          <Box component="ol" sx={{ m: 0, p: 0, listStyle: 'none' }}>
            {experience.map((entry) => (
              <Box
                component="li"
                key={entry.id}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: '10rem minmax(0, 1fr)' },
                  columnGap: 3,
                  '&:last-of-type > div': { pb: 0 },
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    pt: { sm: 0.25 },
                    pl: { xs: 3, sm: 0 },
                    pb: { xs: 0.5, sm: 0 },
                    borderLeft: { xs: 2, sm: 0 },
                    borderColor: 'divider',
                  }}
                >
                  {entry.period}
                </Typography>
                <Box
                  sx={{
                    position: 'relative',
                    pl: 3,
                    pb: 3,
                    borderLeft: 2,
                    borderColor: 'divider',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: -7,
                      top: '0.45em',
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      border: 2,
                      borderColor: 'background.default',
                    },
                  }}
                >
                  <Typography variant="h3" component="h3">
                    {entry.title}
                  </Typography>
                  <Typography color="text.secondary">{entry.organization}</Typography>
                  {entry.description && (
                    <Typography sx={{ mt: 0.5 }}>{entry.description}</Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      <Box component="section" aria-labelledby="contact-heading" sx={sectionSx}>
        <Typography variant="h2" id="contact-heading" sx={{ mb: 1.5 }}>
          {text.about.contact}
        </Typography>
        <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 1.5 }}>
          {profile.email && (
            <Button
              variant="outlined"
              href={`mailto:${profile.email}`}
              startIcon={<MailOutlined />}
            >
              {profile.email}
            </Button>
          )}
          {profile.links.map((link) => (
            <Button
              key={link.href}
              variant="outlined"
              href={link.href}
              rel="me noopener"
              startIcon={<LinkIcon href={link.href} />}
            >
              {link.label}
            </Button>
          ))}
        </Stack>
        {text.about.cvNote && (
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            {text.about.cvNote}
          </Typography>
        )}
      </Box>
    </ThemeRoot>
  );
}
