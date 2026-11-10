import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ThemeRoot from '../theme/ThemeRoot';
import CardGrid from './CardGrid';
import EmptyState from './EmptyState';
import type { ResponsiveImage } from '../data/images';
import { text } from '../data/text';

export interface AlbumSummary {
  href: string;
  title: string;
  date: string;
  dateISO: string;
  location?: string | undefined;
  cover: ResponsiveImage;
  coverAlt: string;
}

export default function AlbumGrid({ albums }: { albums: AlbumSummary[] }) {
  if (albums.length === 0) {
    return (
      <ThemeRoot>
        <EmptyState>{text.hobbies.photos.empty}</EmptyState>
      </ThemeRoot>
    );
  }
  return (
    <ThemeRoot>
      <CardGrid>
        {albums.map((album) => (
          <li key={album.href}>
            <Card sx={{ height: '100%' }}>
              <CardActionArea href={album.href} sx={{ height: '100%', alignItems: 'flex-start' }}>
                <Box
                  component="img"
                  src={album.cover.src}
                  srcSet={album.cover.srcSet}
                  sizes="(min-width: 900px) 400px, (min-width: 600px) 50vw, 100vw"
                  width={album.cover.width}
                  height={album.cover.height}
                  alt={album.coverAlt}
                  loading="lazy"
                  decoding="async"
                  sx={{
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                    aspectRatio: '4 / 3',
                    objectFit: 'cover',
                  }}
                />
                <CardContent>
                  <Typography variant="h3" component="h3">
                    {album.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    <time dateTime={album.dateISO}>{album.date}</time>
                    {album.location && ` · ${album.location}`}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </li>
        ))}
      </CardGrid>
    </ThemeRoot>
  );
}
