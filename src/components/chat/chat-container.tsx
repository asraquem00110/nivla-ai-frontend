import { cn } from '@/lib/utils';
import React from 'react';

type Props = {
  children?: React.ReactNode;
};
export default function ChatContainer({ children }: Props) {
  return (
    <div
      className={cn(
        'bg-gray flex w-full flex-1 flex-col items-center justify-center overflow-y-auto'
      )}
    >
      {children}
    </div>
  );
}
