import ArrowForward from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface Props {
  id: string;
  title: string;
  /** Link to the full page for this section. */
  more?: { href: string; label: string } | undefined;
}

/** Section title row; render inside a ThemeRoot. */
export default function SectionHeader({ id, title, more }: Props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
      <Typography variant="h2" id={id}>
        {title}
      </Typography>
      {more && (
        <Button href={more.href} size="small" endIcon={<ArrowForward fontSize="small" />}>
          {more.label}
        </Button>
      )}
    </Box>
  );
}
