import { createTheme } from '@mui/material/styles';

const fontFamily = [
  'system-ui',
  '-apple-system',
  "'Segoe UI'",
  "'PingFang TC'",
  "'Noto Sans TC'",
  "'Microsoft JhengHei'",
  'sans-serif',
].join(',');

// CSS variables let hand-written styles in global.css reuse the same palette.
export const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'dark',
    primary: { main: '#5eead4' },
    background: { default: '#1c1c1e', paper: '#242427' },
    text: { primary: '#e8e8ea', secondary: '#a1a1a6' },
    divider: '#3a3a3d',
  },
  typography: {
    fontFamily,
    h1: { fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.3 },
    h2: { fontSize: '1.375rem', fontWeight: 700, lineHeight: 1.4 },
    h3: { fontSize: '1.125rem', fontWeight: 700, lineHeight: 1.4 },
    body1: { lineHeight: 1.8 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        // Short pages reserve the scrollbar's space too, so content does not shift between pages.
        html: { scrollbarGutter: 'stable' },
        // PageShell's main element grows, so the footer stays at the bottom of short pages.
        body: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
      },
    },
    MuiCard: {
      defaultProps: { variant: 'outlined' },
    },
    MuiLink: {
      defaultProps: { underline: 'hover' },
    },
  },
});
