import { ThemeProviderContext } from '@/providers/ThemeProvider';
import React, { useContext } from 'react';

export const useTheme = () => {
  const theme = useContext(ThemeProviderContext);
  return theme;
};
