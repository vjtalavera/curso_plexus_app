import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

import App from './App';
import './index.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0f766e',
      dark: '#0b1f2c',
    },
    secondary: {
      main: '#f4b942',
      light: '#ffd57a',
    },
    background: {
      default: '#f3efe6',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
    h4: {
      fontWeight: 800,
      letterSpacing: '-0.03em',
    },
    h5: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h6: {
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
