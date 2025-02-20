import { createContext } from 'react';

import { ThemeProviderState } from '@/components/theme-provider';

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

export const ThemeProviderContext =
  createContext<ThemeProviderState>(initialState);
