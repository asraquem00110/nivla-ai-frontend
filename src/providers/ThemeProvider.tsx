import React, { createContext, useState, type Dispatch, type ReactNode } from 'react';

interface ThemeProviderStateContextType {
  sidebarOpen: boolean;
}

interface ThemeProviderActionsContextType {
  setSidebarOpen: Dispatch<React.SetStateAction<boolean>>;
}

export type ThemeProviderContextType = ThemeProviderStateContextType &
  ThemeProviderActionsContextType;
interface Props {
  children?: ReactNode;
}

export const ThemeProviderContext = createContext<ThemeProviderContextType | undefined>(undefined);

const { Provider } = ThemeProviderContext;

export const ThemeProvider: React.FC<Props> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  return (
    <Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
      }}
    >
      {children}
    </Provider>
  );
};
