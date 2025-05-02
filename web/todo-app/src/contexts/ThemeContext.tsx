import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';
import { createAppTheme } from '../theme/theme';

/**
 * Theme context type definition
 * Provides the current theme mode and a toggle function
 */
interface ThemeContextType {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

/**
 * Create the context with undefined default value
 * The actual value will be provided by the ThemeProvider
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Props for the ThemeProvider component
 */
interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Theme provider component that provides theme context to the application
 * 
 * Features:
 * - Manages light/dark theme mode state
 * - Persists theme preference in localStorage
 * - Respects user's system preference for theme
 * - Provides a function to toggle between light and dark mode
 * - Listens for system theme changes and updates accordingly
 * 
 * @param {ReactNode} children - Child components that will have access to the theme context
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  /**
   * Determines the initial theme mode from local storage or system preference
   * @returns {PaletteMode} The initial theme mode ('light' or 'dark')
   */
  const getInitialMode = (): PaletteMode => {
    const savedMode = localStorage.getItem('theme-mode');
    if (savedMode && (savedMode === 'light' || savedMode === 'dark')) {
      return savedMode;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  };

  // Theme mode state
  const [mode, setMode] = useState<PaletteMode>(getInitialMode);
  
  // Create the MUI theme based on the current mode
  const theme = createAppTheme(mode);

  /**
   * Toggle between light and dark modes
   * Saves the new preference to localStorage
   */
  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme-mode', newMode);
      return newMode;
    });
  };

  // Listen for system theme changes and update if no user preference is set
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme-mode')) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, toggleColorMode }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook for using the theme context
 * 
 * @returns {ThemeContextType} The theme context value (mode and toggleColorMode)
 * @throws {Error} If used outside of a ThemeProvider
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext; 