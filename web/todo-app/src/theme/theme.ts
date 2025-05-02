import { createTheme, PaletteMode } from '@mui/material';

// Color palette definitions
const lightPalette = {
  primary: {
    main: '#3f51b5', // Indigo
    light: '#757de8',
    dark: '#002984',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#f50057', // Pink
    light: '#ff5983',
    dark: '#bb002f',
    contrastText: '#ffffff',
  },
  background: {
    default: '#f5f5f5',
    paper: '#ffffff',
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.6)',
    disabled: 'rgba(0, 0, 0, 0.38)',
  },
};

const darkPalette = {
  primary: {
    main: '#5c6bc0', // Lighter Indigo
    light: '#8e99f3',
    dark: '#26418f',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#ff4081', // Lighter Pink
    light: '#ff79b0',
    dark: '#c60055',
    contrastText: '#ffffff',
  },
  background: {
    default: '#121212',
    paper: '#1e1e1e',
  },
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.7)',
    disabled: 'rgba(255, 255, 255, 0.5)',
  },
};

// Create theme based on mode
export const createAppTheme = (mode: PaletteMode) => {
  return createTheme({
    palette: {
      mode,
      ...(mode === 'light' ? lightPalette : darkPalette),
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 500,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 500,
      },
      h3: {
        fontSize: '1.8rem',
        fontWeight: 500,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 500,
      },
      h5: {
        fontSize: '1.2rem',
        fontWeight: 500,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 500,
      },
      button: {
        textTransform: 'none', // Prevent all-caps buttons
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 16px',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: mode === 'light' 
              ? '0 4px 6px rgba(0,0,0,0.1)' 
              : '0 4px 6px rgba(0,0,0,0.5)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
    },
  });
}; 