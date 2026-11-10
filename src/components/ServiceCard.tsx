import ArrowOutward from '@mui/icons-material/ArrowOutward';
import GitHub from '@mui/icons-material/GitHub';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { Service } from '../data/services';
import { text } from '../data/text';

const statusColor = {
  active: 'success',
  beta: 'warning',
  maintenance: 'info',
  archived: 'default',
} as const;

interface Props {
  service: Service;
  /** Adds the technology chips, for /services/. */
  detailed?: boolean;
}

/**
 * Services are apps to use, not pages to read, so they get an explicit open button instead of
 * a whole-card link. Cards with a check path get a live status from ServiceStatus.astro.
 * Render inside a ThemeRoot.
 */
export default function ServiceCard({ service, detailed = false }: Props) {
  return (
    <Card data-service-check={service.checkPath} sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              columnGap: 1,
              rowGap: 0.5,
              flexGrow: 1,
              minWidth: 0,
              minHeight: 34,
            }}
          >
            <Typography variant="h3" component="h3">
              {service.name}
            </Typography>
            {/* The status script swaps the declared status for the unreachable one. */}
            <span data-status="declared">
              <Chip
                size="small"
                variant="outlined"
                label={text.services.status[service.status]}
                color={statusColor[service.status]}
              />
            </span>
            {service.checkPath && (
              <span data-status="unreachable" hidden>
                <Chip
                  size="small"
                  variant="outlined"
                  label={text.services.unreachable}
                  color="error"
                />
              </span>
            )}
          </Box>
          {/* Icon-only buttons; the label from site.yaml stays as tooltip and accessible name. */}
          <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
            {service.source && (
              <IconButton
                size="small"
                href={service.source}
                rel="noopener"
                aria-label={text.services.source}
                title={text.services.source}
                color="primary"
              >
                <GitHub fontSize="small" />
              </IconButton>
            )}
            {service.status !== 'archived' && (
              <IconButton
                size="small"
                href={service.url}
                aria-label={text.services.open}
                title={text.services.open}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
              >
                <ArrowOutward fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {service.description}
        </Typography>
        {detailed && service.stack.length > 0 && (
          <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 0.75, mt: 1.5 }}>
            {service.stack.map((item) => (
              <Chip key={item} size="small" label={item} />
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
