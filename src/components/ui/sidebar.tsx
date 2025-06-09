import React from 'react';
import { useTheme } from '@/hooks/use-theme-context';
import { cn } from '@/lib/utils';
import type { ThemeProviderContextType } from '@/providers/ThemeProvider';

export const SideNavigation = () => {
  const theme = useTheme() as unknown as ThemeProviderContextType;

  return (
    <>
      {/* Burger icon for toggling sidebar */}
      <button
        className={cn('fixed top-1 left-4 z-40 cursor-pointer rounded p-2 text-gray-800')}
        onClick={() => theme.setSidebarOpen(open => !open)}
        aria-label="Toggle sidebar"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-gray-200 bg-[#F9F9F9] transition-transform duration-300',
          theme.sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'w-[300px]'
        )}
      >
        {/* Side nav content goes here */}
      </aside>
    </>
  );
};
