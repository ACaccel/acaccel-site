import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ThemeRoot from '../theme/ThemeRoot';
import PageHeader from './PageHeader';
import Prose from './Prose';
import type { ResponsiveImage } from '../data/images';
import { trails } from '../data/site';

export interface AlbumPhoto {
  image: ResponsiveImage;
  /** Larger rendition opened when the photo is clicked. */
  large: string;
  alt: string;
  caption?: string | undefined;
}

interface Props {
  title: string;
  description: string;
  date: string;
  dateISO: string;
  location?: string | undefined;
  photos: AlbumPhoto[];
  /** The rendered album notes, if any. */
  children?: ReactNode;
}

export default function AlbumDetail(props: Props) {
  const { title, description, date, dateISO, location, photos, children } = props;
  return (
    <ThemeRoot>
      <PageHeader title={title} description={description} trail={trails.photos}>
        <time dateTime={dateISO}>{date}</time>
        {location && ` · ${location}`}
      </PageHeader>
      <Prose>{children}</Prose>
      <Box
        component="ul"
        sx={{
          display: 'grid',
          gap: 2,
          m: 0,
          mt: 4,
          p: 0,
          listStyle: 'none',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(3, minmax(0, 1fr))',
          },
        }}
      >
        {photos.map((photo) => (
          <li key={photo.large}>
            <Box component="figure" sx={{ m: 0 }}>
              <a href={photo.large}>
                <Box
                  component="img"
                  src={photo.image.src}
                  srcSet={photo.image.srcSet}
                  sizes="(min-width: 900px) 400px, (min-width: 600px) 50vw, 100vw"
                  width={photo.image.width}
                  height={photo.image.height}
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                  sx={{ display: 'block', width: '100%', height: 'auto', borderRadius: 1 }}
                />
              </a>
              {photo.caption && (
                <Typography
                  component="figcaption"
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {photo.caption}
                </Typography>
              )}
            </Box>
          </li>
        ))}
      </Box>
    </ThemeRoot>
  );
}
