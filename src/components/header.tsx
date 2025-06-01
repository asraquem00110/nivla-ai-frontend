import { cn } from '@/lib/utils';
import React from 'react';

type Props = {
  isSideNavOpen?: boolean;
};

export default function Header({ isSideNavOpen }: Props) {
  return (
    <header
      className={cn(
        'fixed w-full px-4 py-2',
        'h-[72px]',
        isSideNavOpen ? 'pl-[320px]' : 'pl-[60px]',
        'pt-2'
      )}
    >
      <span className="text-2xl font-semibold">NivlA AI</span>
    </header>
  );
}
