import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import ChatContainer from '@/components/chat/chat-container';
import ChatHeader from '@/components/chat/chat-header';
import MessageList from '@/components/chat/message-list';
import ChatInput from '@/components/chat/chat-input';
import { cn } from '@/lib/utils';
import Header from '@/components/header';
import type { Prompt } from '@/types/Prompt';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const [messages, setMessages] = useState<Array<Prompt>>([
    { role: 'system', message: 'You are NivlA AI, a helpful assistant.' }, // system message
    { role: 'assistant', message: 'Hello! How can I help you today?' },
  ]);

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const handleSend = (message: string) => {
    setMessages(prev => [
      ...prev,

      { role: 'user', message },
      { role: 'assistant', message: 'NivlA AI said: ' + message }, // mock reply
    ]);
  };
  return (
    <div>
      {/* Burger icon for toggling sidebar */}
      <button
        className={cn('fixed top-1 left-4 z-40 cursor-pointer rounded p-2 text-gray-800')}
        onClick={() => setSidebarOpen(open => !open)}
        aria-label="Toggle sidebar"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-gray-200 bg-[#F9F9F9] transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'w-[300px]'
        )}
      >
        {/* Side nav content goes here */}
      </aside>
      <div className={cn('main flex h-screen flex-col')}>
        <Header isSideNavOpen={sidebarOpen} />
        <div className={cn(sidebarOpen ? 'ml-[300px]' : '', 'flex flex-1 flex-col p-4')}>
          <ChatContainer>
            <MessageList messages={messages} />
          </ChatContainer>
          <ChatInput onSend={handleSend} isSideNavOpen={sidebarOpen} />
        </div>
      </div>
    </div>
  );
}
