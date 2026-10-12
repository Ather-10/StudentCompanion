import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { LIGHT, DARK } from './colors';
import { usePersistentState } from '../utils/storage';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const system = useColorScheme();
  const [mode, setMode, loaded] = usePersistentState('theme-mode', 'system'); // 'system' | 'light' | 'dark'
  const isDark = mode === 'dark' || (mode === 'system' && system === 'dark');
  const value = useMemo(() => ({ C: isDark ? DARK : LIGHT, isDark, mode, setMode }), [isDark, mode]);
  if (!loaded) return null; // wait a moment so the saved theme shows without flicker
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);

// Builds a screen's styles from the current theme colors.
export function useStyles(factory) {
  const { C } = useTheme();
  return useMemo(() => factory(C), [C]);
}
